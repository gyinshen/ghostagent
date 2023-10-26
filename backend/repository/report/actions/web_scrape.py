"""Selenium web scraping module."""
from __future__ import annotations
import asyncio
from pathlib import Path
# from sys import platform
from PyPDF2 import PdfReader

import requests
from io import BytesIO
import os

from bs4 import BeautifulSoup
# from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.safari.options import Options as SafariOptions
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait
# from fastapi import WebSocket
from seleniumwire import webdriver
from selenium.common.exceptions import TimeoutException
import time
import repository.report.processing.text as summary
from repository.report.config import Config
from repository.report.processing.html import extract_hyperlinks, format_hyperlinks
from asyncio import Semaphore
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor()

FILE_DIR = Path(__file__).parent.parent
CFG = Config()

PROXY_HTTP = os.environ.get("PROXY_HTTP")
PROXY_HTTPS = os.environ.get("PROXY_HTTPS")


sem = Semaphore(200)  # Limit to 12 concurrent tasks

async def async_browse(url: str, question: str) -> str:
    driver = None  # Initialize the driver
    async with sem:  # Limits the number of concurrent tasks
        loop = asyncio.get_event_loop()

        print(f"Scraping url {url} with question {question}")
        print(f"🔎 Browsing {url} for relevant about: {question}...")

        try:
            # Create a new WebDriver instance in each thread
            driver, text = await loop.run_in_executor(None, scrape_text_with_selenium, url)
            await loop.run_in_executor(None, add_header, driver)
            summary_text = await loop.run_in_executor(None, summary.summarize_text, url, text, question, driver)

            print(f"📝 Information gathered from url {url}: {summary_text}\n\n\n\n")
            return f"📝 Information gathered from url {url}: {summary_text}\n\n\n\n"
        except Exception as e:
            print(f"An error occurred while processing the url {url}: {e}")
            return f"Error processing the url {url}: {e}"
        finally:
            if driver is not None:
                # Make sure to close the WebDriver instance after using it
                driver.quit()


def scrape_text_with_selenium(url: str) -> tuple[WebDriver, str]:
    driver = None
    text = ''
    soup = None
    
    try:
        # logging.getLogger("selenium").setLevel(logging.CRITICAL)

        options_available = {"chrome": ChromeOptions, "safari": SafariOptions, "firefox": FirefoxOptions,}
        options = options_available[CFG.selenium_web_browser]()
        # seleniumwire_options = {
        #     'proxy': {
        #         'http': PROXY_HTTP,
        #         'https': PROXY_HTTPS,
        #     }
        # }

        # Create a separate proxy dictionary for 'requests'
        # requests_proxy = {
        #     'http': PROXY_HTTP,
        #     'https': PROXY_HTTPS,
        # }

        options.add_argument(CFG.user_agent)
        options.add_argument('--headless')
        options.add_argument("--no-sandbox")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0")

        if CFG.selenium_web_browser == "firefox":
            service = Service(executable_path=GeckoDriverManager().install())
            # driver = webdriver.Firefox(seleniumwire_options=seleniumwire_options, service=service, options=options)
            driver = webdriver.Firefox(service=service, options=options)

        elif CFG.selenium_web_browser == "safari":
            # driver = webdriver.Safari(seleniumwire_options=seleniumwire_options, options=options)
            driver = webdriver.Safari(options=options)
        else:
            options.add_experimental_option("prefs", {"download_restrictions": 3, "profile.managed_default_content_settings.images": 2})
            # driver = webdriver.Chrome(seleniumwire_options=seleniumwire_options, options=options)
            driver = webdriver.Chrome(options=options)

        time.sleep(1)
        driver.set_page_load_timeout(17)

        # Check if the URL ends with '.pdf'
        # response = requests.get(url, proxies=requests_proxy) # type: ignore
        response = requests.get(url) # type: ignore
        if 'Content-Type' in response.headers and response.headers['Content-Type'] == 'application/pdf':
            # Use requests to get the pdf file, pass the requests_proxy dictionary
            # response = requests.get(url, proxies=requests_proxy)

            # Create a pdf file reader object
            pdf_file = PdfReader(BytesIO(response.content))

            # Initialize text to an empty string
            text = ''

            # Iterate through all the pages and extract text
            # for page_num in range(pdf_file.getNumPages()):
            #     page = pdf_file.getPage(page_num)
            #     text += page.extractText()
            for page in pdf_file.pages:
                text += page.extract_text()

            # Process the text like we do for HTML pages
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = "\n".join(chunk for chunk in chunks if chunk)
        else:
            driver.get(url)
            WebDriverWait(driver, 25).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(1) 
            page_source = driver.execute_script("return document.body.outerHTML;")
            soup = BeautifulSoup(page_source, "html.parser")

            for script in soup(["script", "style"]):
                script.extract()

            text = get_text(soup)
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = "\n".join(chunk for chunk in chunks if chunk)

        return driver, text
    except TimeoutException as e:
        # raise Exception(f"Timeout occurred while loading the URL: {url}") from e
        print(f"Timeout occurred while loading the URL: {url}")
    except Exception as e:
        raise e
    finally:
        # Extract the page source even if a TimeoutException occurs
        if driver is not None and soup is None:
            page_source = driver.execute_script("return document.documentElement.outerHTML;")
            soup = BeautifulSoup(page_source, "html.parser")
        
        # Process the soup to extract the text
        if soup is not None:
            for script in soup(["script", "style"]):
                script.extract()

            text = get_text(soup)
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = "\n".join(chunk for chunk in chunks if chunk)

        return driver, text # type: ignore


def get_text(soup):
    """Get the text from the soup

    Args:
        soup (BeautifulSoup): The soup to get the text from

    Returns:
        str: The text from the soup
    """
    text = ""
    tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'p']
    for element in soup.find_all(tags):  # Find all the <p> elements
        text += element.text + "\n\n"
    return text


def scrape_links_with_selenium(driver: WebDriver, url: str) -> list[str]:
    """Scrape links from a website using selenium

    Args:
        driver (WebDriver): The webdriver to use to scrape the links

    Returns:
        List[str]: The links scraped from the website
    """
    page_source = driver.page_source
    soup = BeautifulSoup(page_source, "html.parser")

    for script in soup(["script", "style"]):
        script.extract()

    hyperlinks = extract_hyperlinks(soup, url)

    return format_hyperlinks(hyperlinks)


def close_browser(driver: WebDriver) -> None:
    """Close the browser

    Args:
        driver (WebDriver): The webdriver to close

    Returns:
        None
    """
    driver.quit()


def add_header(driver: WebDriver) -> None:
    """Add a header to the website

    Args:
        driver (WebDriver): The webdriver to use to add the header

    Returns:
        None
    """
    if driver is not None:
        try:
            driver.execute_script(open(f"{FILE_DIR}/js/overlay.js", "r").read())
        except Exception as e:
            print(f"An error occurred while executing script: {e}")
    else:
        print("Driver is None, cannot add header")