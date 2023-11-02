# Description: Research assistant class that handles the research process for a given question.

# libraries
import asyncio
import json
from repository.report.actions.web_search import web_search
from repository.report.actions.web_scrape import async_browse
from repository.report.processing.text import \
    write_to_file, \
    create_message, \
    create_chat_completion, \
    read_txt_files, \
    write_md_to_pdf
from repository.report.config import Config
from repository.report.agent import prompts
import os
import string
import datetime
from typing import AsyncIterable


CFG = Config()

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]


class ResearchAgent:
    def __init__(self, question, agent, agent_role_prompt, status_callback):
        """ Initializes the research assistant with the given question.
        Args: question (str): The question to research
        Returns: None
        """

        self.question = question
        self.agent = agent
        self.agent_role_prompt = agent_role_prompt
        self.visited_urls = set()
        self.research_summary = ""
        # self.directory_name = ''.join(c for c in question if c.isascii() and c not in string.punctuation)[:100]
        date_time = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        sanitized_question = ''.join(c for c in question if c.isascii() and c not in string.punctuation)[:20]
        self.directory_name = f'{date_time}_{sanitized_question}'
        self.dir_path = os.path.dirname(f"./outputs/{self.directory_name}/")
        self.status_callback = status_callback

    async def send_status(self, message):
        if self.status_callback:
            await self.status_callback(message)  # Add the await keyword here



    async def summarize(self, text, topic):
        """ Summarizes the given text for the given topic.
        Args: text (str): The text to summarize
                topic (str): The topic to summarize the text for
        Returns: str: The summarized text
        """

        messages = [create_message(text, topic)]
        # await self.send_status(f"📝 Summarizing text for query: {text}")

        return create_chat_completion(
            model=CFG.fast_llm_model,
            messages=messages,
        )

    # async def get_new_urls(self, url_set_input):
    #     """ Gets the new urls from the given url set.
    #     Args: url_set_input (set[str]): The url set to get the new urls from
    #     Returns: list[str]: The new urls from the given url set
    #     """

    #     new_urls = []
    #     for url in url_set_input:
    #         if url not in self.visited_urls:
    #             await self.send_status(f"✅ Adding source url to research: {url}\n")
    #             self.visited_urls.add(url)
    #             new_urls.append(url)

    #     return new_urls

    async def get_new_urls(self, url_set_input):
        """ Gets the new urls from the given url set.
        Args: url_set_input (set[str]): The url set to get the new urls from
        Returns: tuple[list[str], str]: The new urls from the given url set and the message about the new urls
        """

        new_urls = []
        message_get_new_urls = ""
        for url in url_set_input:
            if url not in self.visited_urls:
                message_get_new_urls += f"✅ Adding source url to research: {url}\n\n"
                self.visited_urls.add(url)
                new_urls.append(url)

        return new_urls, message_get_new_urls


    async def call_agent(self, action, stream=False, status_callback=None):
        messages = [{
            "role": "system",
            "content": self.agent_role_prompt if self.agent_role_prompt else prompts.generate_agent_role_prompt(self.agent)
        }, {
            "role": "user",
            "content": action,
        }]
        answer = create_chat_completion(
            model=CFG.smart_llm_model,
            messages=messages,
            stream=stream,
            # websocket=status_callback,
        )
        return answer

    async def create_search_queries(self):
        """ Creates the search queries for the given question.
        Args: None
        Returns: tuple[list[str], str]: The search queries for the given question and the message about search queries
        """
        result = await self.call_agent(prompts.generate_search_queries_prompt(self.question))
        print(result)
        message_search_queries = f"🧠 I will conduct my research based on the following queries: {result}...\n\n"
        # no longer calling self.send_status
        return json.loads(result), message_search_queries


    async def async_search(self, query):
        """ Runs the async search for the given query.
        Args: query (str): The query to run the async search for
        Returns: tuple[list[str], str, str]: The async search for the given query, the message about the new URLs, and the message about the async search
        """
        search_results = json.loads(web_search(query))
        new_search_urls, message_get_new_urls = await self.get_new_urls([url.get("href") for url in search_results])

        message_async_search = f"🌐 Browsing the following sites for relevant information...\n\n"

        # Create a list to hold the coroutine objects
        tasks = [async_browse(url, query, self.directory_name) for url in new_search_urls]

        # Gather the results as they become available
        responses = await asyncio.gather(*tasks, return_exceptions=True)

        return responses, message_get_new_urls, message_async_search


    async def run_search_summary(self, query):
        """ Runs the search summary for the given query.
        Args: query (str): The query to run the search summary for
        Returns: tuple[str, str]: The search summary for the given query and the message about the research
        """

        message_research_result = f"🔎 Running research for '{query}'..."

        responses, message_get_new_urls, message_async_search = await self.async_search(query)

        result = "\n".join(responses)
        short_query = query[:30]

        os.makedirs(os.path.dirname(f"./outputs/{self.directory_name}/research-{short_query}.txt"), exist_ok=True)
        write_to_file(f"./outputs/{self.directory_name}/research-{short_query}.txt", result)
        return result, message_research_result, message_get_new_urls, message_async_search



    async def conduct_research(self):
        self.research_summary = read_txt_files(self.dir_path) if os.path.isdir(self.dir_path) else ""

        if not self.research_summary:
            search_queries = await self.create_search_queries()

            async def process_query(query):
                research_result = await self.run_search_summary(query)
                self.research_summary += "\n\n" + research_result # type: ignore
                return research_result

            tasks = [process_query(query) for query in search_queries]

            for task in asyncio.as_completed(tasks):
                research_result = await task
                yield research_result

        # await self.send_status(f"Total research words: {len(self.research_summary.split(' '))}")

        # yield the final result
        yield self.research_summary



    async def create_concepts(self):
        """ Creates the concepts for the given question.
        Args: None
        Returns: list[str]: The concepts for the given question
        """
        result = self.call_agent(prompts.generate_concepts_prompt(self.question, self.research_summary))

        await self.send_status(f"I will research based on the following concepts: {result}\n")
        

        return json.loads(result) # type: ignore

    async def write_report(self, report_type):
        """ Writes the report for the given question.
        Args: None
        Returns: tuple[str, str, str]: The report for the given question, the path of the report, and the message about the report
        """
        report_type_func = prompts.get_report_by_type(report_type)
        # message_write_report = f"✍️ Writing {report_type} for research task: {self.question}...\n"
        answer = await self.call_agent(report_type_func(self.question, self.research_summary), stream=True)

        path = await write_md_to_pdf(report_type, self.directory_name, answer)

        return answer, path


    async def write_lessons(self):
        """ Writes lessons on essential concepts of the research.
        Args: None
        Returns: None
        """
        concepts = await self.create_concepts()
        for concept in concepts:
            answer = await self.call_agent(prompts.generate_lesson_prompt(concept), stream=True)
            await write_md_to_pdf("Lesson", self.directory_name, answer)
