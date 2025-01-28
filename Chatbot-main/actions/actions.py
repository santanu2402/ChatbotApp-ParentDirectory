from datetime import datetime
from typing import Text, List, Any, Dict
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests
from rasa_sdk.events import SlotSet
from iso639 import languages
import random


class RespondToGeneralQuestion(Action):
    def name(self) -> Text:
        return "respond_to_general_question"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        intent = tracker.latest_message['intent'].get('name')

        if intent == 'general_question':
            if 'how are you doing' in tracker.latest_message['text']:
                dispatcher.utter_message("I'm just a machine, but I'm here to help. Ask me anything!")

            elif 'feelings' in tracker.latest_message['text']:
                dispatcher.utter_message("I don't have feelings, but I'm always ready to assist you.")

            elif 'love me' in tracker.latest_message['text']:
                dispatcher.utter_message("I don't experience love, but I'm here to provide information and support.")

            elif 'apple siri' in tracker.latest_message['text']:
                dispatcher.utter_message(
                    "Yes, I'm familiar with Apple Siri. We're both virtual assistants designed to assist users.")

            elif 'google assistant' in tracker.latest_message['text']:
                dispatcher.utter_message("Yes, I know Google Assistant. It's another virtual assistant like me.")

            elif 'favorite color' in tracker.latest_message['text']:
                dispatcher.utter_message("I don't have a favorite color. What's yours?")

            elif 'joke' in tracker.latest_message['text']:
                dispatcher.utter_message("Sure, here's a joke: [Your joke goes here]")

            elif 'recommend a movie' in tracker.latest_message['text']:
                dispatcher.utter_message("Certainly! What genre are you in the mood for, and any specific preferences?")

            else:
                dispatcher.utter_message("I'm not sure how to respond to that.")

        return []


class ActionIntroduceBot(Action):
    def name(self) -> Text:
        return "action_introduce_bot"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        introductions = [
            "Meet CinePulse Bot, your ultimate companion in the cinematic universe! Developed by the talented trio—Santanu, Anuska, and Isshita—forming the dynamic CinePulse Team, this chatbot is set to redefine your movie experience. Powered by the robust database of The Movie Database (TMDb), CinePulse Bot is not just a chatbot; it's your cinephile friend who knows the ins and outs of the film world.",
            "Greetings! I am CinePulse Bot, crafted by the skilled hands of Santanu, Anuska, and Isshita from the CinePulse Team. Dive into the world of movies with me, as I bring you insights and information, all powered by the extensive knowledge of The Movie Database (TMDb).",
            "Hello there! I'm CinePulse Bot, a creation of Santanu, Anuska, and Isshita—your cinephile companions from the CinePulse Team. Immerse yourself in the cinematic realm with me, leveraging the vast resources of The Movie Database (TMDb)."
        ]

        introduction = random.choice(introductions)
        dispatcher.utter_message(introduction)
        return []


class ActionHandleNegativeFeedback(Action):
    def name(self) -> Text:
        return "action_handle_negative_feedback"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = (
            "Cinepulse developer team has worked hard to build Cinepulse, and they are continuously working to improve based on user feedback. "
            "If you are facing any issues, please refer to our documentation website for help. "
            "If you have suggestions for improvements, feel free to provide us feedback. "
            "Visit our website for documentation and feedback - www.cinepulse.santanumandal.com")
        dispatcher.utter_message(response)
        return []


class ActionAcknowledgePositiveFeedback(Action):
    def name(self) -> Text:
        return "action_acknowledge_positive_feedback"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        response = (
            "Thank you! The hard work of the Cinepulse developer team has paid off, and they are continuously working to make "
            "Cinepulse more improved, insightful, modern, efficient, and user-friendly. "
            "Please provide us with feedback on our documentation website; we would love to hear from you. "
            "Visit our website for documentation and feedback - www.cinepulse.santanumandal.com")
        dispatcher.utter_message(response)
        return []


class ActionSetMovieTitle(Action):
    def name(self) -> Text:
        return "action_set_movie_title"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Extract movie title from user message
        movie_title = tracker.latest_message['text']
        if movie_title:
            return [SlotSet("movie_title", movie_title)]
        else:
            dispatcher.utter_message("Sorry, I have not recognized any movie title. Please enter a valid movie title.")
            return []


class ActionSetCastName(Action):
    def name(self) -> Text:
        return "action_set_movie_cast_name"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Extract movie title from user message
        cast_name = tracker.latest_message['text']
        if cast_name:
            return [SlotSet("cast_name", cast_name)]
        else:
            dispatcher.utter_message("Sorry, I have not recognized any cast name. Please enter a valid cast name.")
            return []


class ActionSetGenres(Action):
    def name(self) -> Text:
        return "action_set_movie_genre"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Extract movie title from user message
        genre = tracker.latest_message['text']
        if genre:
            return [SlotSet("genre", genre)]
        else:
            dispatcher.utter_message("Sorry, I have not recognized any genre. Please enter a valid genre.")
            return []


class ActionGetMovieDirector(Action):
    def name(self) -> Text:
        return "action_get_movie_director"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits for the movie and find the director
            cred_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            cred_headers = {
                'accept': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
            }

            cred_options = {
                'headers': cred_headers
            }

            credits_response = requests.get(cred_url, **cred_options)
            credits_data = credits_response.json()

            # Find the director in the crew section
            director = next((member['name'] for member in credits_data.get('crew', []) if member['job'] == 'Director'),
                            None)

            if director:
                dispatcher.utter_message(f"The director of {movie_title} is {director}.")
            else:
                dispatcher.utter_message(
                    f"Sorry, I couldn't find information about the director of {movie_title}.")
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieOverview(Action):
    def name(self) -> Text:
        return "action_get_movie_overview"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            overview = search_results['results'][0]['overview']
            # Create a response for the bot
            response_message = f"The overview of {movie_title} is: {overview}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieGenres(Action):
    def name(self) -> Text:
        return "action_get_movie_genres"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its genres
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the genre IDs of the first movie in the search results
            genre_ids = search_results['results'][0]['genre_ids']

            # Map genre IDs to genre names using the provided dictionary
            movie_genres = {
                28: "Action",
                12: "Adventure",
                16: "Animation",
                35: "Comedy",
                80: "Crime",
                99: "Documentary",
                18: "Drama",
                10751: "Family",
                14: "Fantasy",
                36: "History",
                27: "Horror",
                10402: "Music",
                9648: "Mystery",
                10749: "Romance",
                878: "Science Fiction",
                10770: "TV Movie",
                53: "Thriller",
                10752: "War",
                37: "Western"
            }

            # Get genre names based on genre IDs
            movie_genre_names = [movie_genres.get(genre_id, "Unknown") for genre_id in genre_ids]

            # Create a response for the bot
            response_message = f"The genres of {movie_title} are: {', '.join(movie_genre_names)}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieRating(Action):
    def name(self) -> Text:
        return "action_get_movie_rating"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its details
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the vote average of the first movie in the search results
            vote_average = search_results['results'][0]['vote_average']

            # Round off the vote average to two decimal places
            rounded_rating = round(vote_average, 2)

            # Create a response for the bot
            response_message = f"The rating of {movie_title} is: {rounded_rating}/10"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieReleasedDate(Action):
    def name(self) -> Text:
        return "action_get_movie_released_date"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its details
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the release date of the first movie in the search results
            release_date = search_results['results'][0]['release_date']

            # Convert release date to a more readable format (e.g., "25 January, 2023")
            formatted_release_date = datetime.strptime(release_date, '%Y-%m-%d').strftime('%d %B, %Y')

            # Create a response for the bot
            response_message = f"The release date of {movie_title} is: {formatted_release_date}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieReleasedStatus(Action):
    def name(self) -> Text:
        return "action_get_movie_released_status"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its details
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the release date of the first movie in the search results
            release_date_str = search_results['results'][0]['release_date']

            # Convert release date to datetime object
            release_date = datetime.strptime(release_date_str, '%Y-%m-%d')

            # Get the current date
            current_date = datetime.now()

            # Check if the movie is released or upcoming
            if current_date >= release_date:
                status = "released"
            else:
                status = "upcoming"

            # Create a response for the bot
            response_message = f"The release status of {movie_title} is: {status}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieRuntime(Action):
    def name(self) -> Text:
        return "action_get_movie_runtime"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie including runtime
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Get runtime in minutes and convert to hours and minutes format
            runtime_minutes = movie_details.get('runtime', 0)
            hours, minutes = divmod(runtime_minutes, 60)
            runtime_formatted = f"{hours:02d} hours {minutes:02d} minutes"

            # Create a response for the bot
            response_message = f"The runtime of {movie_title} is: {runtime_formatted}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieBudget(Action):
    def name(self) -> Text:
        return "action_get_movie_budget"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie including budget
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Get budget in US dollars and format it to Indian Rupees
            budget_usd = movie_details.get('budget', 0)
            budget_inr = int(budget_usd * 83)  # Assuming an exchange rate of 1 USD = 83 INR
            formatted_budget = f"US$ {budget_usd:,} (₹ {budget_inr:,} )"

            # Create a response for the bot
            response_message = f"The budget of {movie_title} is: {formatted_budget}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieRevenue(Action):
    def name(self) -> Text:
        return "action_get_movie_revenue"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie including revenue
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Get revenue in US dollars
            revenue_usd = movie_details.get('revenue', 0)

            # Convert revenue to INR
            exchange_rate = 83
            revenue_inr = revenue_usd * exchange_rate

            # Format revenue in both USD and INR
            formatted_revenue_usd = f"US$ {revenue_usd:,.2f}"
            formatted_revenue_inr = f"₹ {revenue_inr:,.2f}"

            # Create a response for the bot
            response_message = f"The revenue of {movie_title} is: {formatted_revenue_usd} ({formatted_revenue_inr})"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieCountryOfOrigin(Action):
    def name(self) -> Text:
        return "action_get_movie_country_of_origin"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie including country of origin
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Get country of origin ISO code
            country_iso_code = movie_details.get('production_countries', [])[0].get('iso_3166_1')

            # Convert ISO code to full country name
            country_name_url = f'https://restcountries.com/v3/alpha/{country_iso_code.lower()}'
            country_name_response = requests.get(country_name_url)
            country_name_data = country_name_response.json()
            country_name = country_name_data[0].get('name', {}).get('common')

            # Create a response for the bot
            response_message = f"The country of origin for {movie_title} is: {country_name}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieLanguageSpoken(Action):
    def name(self) -> Text:
        return "action_get_movie_language_spoken"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie including original language
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Get ISO 639-1 code for the original language
            original_language_code = movie_details.get('original_language', '')

            # Convert ISO 639-1 code to the normal language name
            language_name = languages.get(alpha2=original_language_code).name

            # Create a response for the bot
            response_message = f"The original language of {movie_title} is: {language_name}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")


class ActionGetMovieCast(Action):
    def name(self) -> Text:
        return "action_get_movie_cast"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract top 10 cast members
            cast_list = credits_data.get('cast', [])[:10]

            # Create a response message
            response_message = "The top 10 cast members for {} are:".format(movie_title)

            for cast_member in cast_list:
                character_name = cast_member.get('character', 'N/A')
                original_name = cast_member.get('original_name', 'N/A')
                gender = cast_member.get('gender', 0)

                gender_name = "Male" if gender == 2 else "Female" if gender == 1 else "N/A"
                response_message += f"\n- {original_name} as {character_name} ({gender_name})"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieProductionCompany(Action):
    def name(self) -> Text:
        return "action_get_movie_production_company"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get details of the movie
            details_url = f'https://api.themoviedb.org/3/movie/{movie_id}'
            details_response = requests.get(details_url, **search_options)
            movie_details = details_response.json()

            # Extract production companies with origin country
            production_companies = movie_details.get('production_companies', [])

            # Create a response message
            response_message = f"The production companies for {movie_title} are:"
            for company in production_companies:
                company_name = company.get('name', 'N/A')
                origin_country = company.get('origin_country', 'N/A')
                response_message += f"\n- {company_name} ({origin_country})"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMoviePlaybackSinger(Action):
    def name(self) -> Text:
        return "action_get_movie_playback_singer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract playback singers from the crew
            crew_list = credits_data.get('crew', [])
            playback_singers = [member for member in crew_list if member.get('job') == 'Playback Singer']

            # Create a response message
            response_message = f"The playback singers for {movie_title} are:"

            for singer in playback_singers:
                singer_name = singer.get('name', 'N/A')
                response_message += f"\n- {singer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieCostumeDesigner(Action):
    def name(self) -> Text:
        return "action_get_movie_costume_designer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract costume designers from the crew
            crew_list = credits_data.get('crew', [])
            costume_designers = [member for member in crew_list if member.get('job') == 'Costume Designer']

            # Create a response message
            response_message = f"The costume designers for {movie_title} are:"

            for designer in costume_designers:
                designer_name = designer.get('name', 'N/A')
                response_message += f"\n- {designer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieWriter(Action):
    def name(self) -> Text:
        return "action_get_movie_writer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract writers from the crew
            crew_list = credits_data.get('crew', [])
            writers = [member for member in crew_list if member.get('department') == 'Writing']

            # Create a response message
            response_message = f"The writers for {movie_title} are:"

            for writer in writers:
                writer_name = writer.get('name', 'N/A')
                response_message += f"\n- {writer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieComposer(Action):
    def name(self) -> Text:
        return "action_get_movie_composer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract composers from the crew
            crew_list = credits_data.get('crew', [])
            composers = [member for member in crew_list if member.get('job') == 'Original Music Composer']

            # Create a response message
            response_message = f"The composers for {movie_title} are:"

            for composer in composers:
                composer_name = composer.get('name', 'N/A')
                response_message += f"\n- {composer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieChoreographer(Action):
    def name(self) -> Text:
        return "action_get_movie_choreographer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract choreographers from the crew
            crew_list = credits_data.get('crew', [])
            choreographers = [member for member in crew_list if member.get('job') == 'Choreographer']

            # Create a response message
            response_message = f"The choreographers for {movie_title} are:"

            for choreographer in choreographers:
                choreographer_name = choreographer.get('name', 'N/A')
                response_message += f"\n- {choreographer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieEditor(Action):
    def name(self) -> Text:
        return "action_get_movie_editor"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract editors from the crew
            crew_list = credits_data.get('crew', [])
            editors = [member for member in crew_list if member.get('job') == 'Editor']

            # Create a response message
            response_message = f"The editors for {movie_title} are:"

            for editor in editors:
                editor_name = editor.get('name', 'N/A')
                response_message += f"\n- {editor_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionGetMovieProducer(Action):
    def name(self) -> Text:
        return "action_get_movie_producer"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Use TMDb API to get credits of the movie
            credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
            credits_response = requests.get(credits_url, **search_options)
            credits_data = credits_response.json()

            # Extract producers from the crew
            crew_list = credits_data.get('crew', [])
            producers = [member for member in crew_list if member.get('job') == 'Producer']

            # Create a response message
            response_message = f"The producers for {movie_title} are:"

            for producer in producers:
                producer_name = producer.get('name', 'N/A')
                response_message += f"\n- {producer_name}"

            dispatcher.utter_message(response_message)

        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionIsReleased(Action):
    def name(self) -> Text:
        return "action_is_released"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its details
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the release date of the first movie in the search results
            release_date_str = search_results['results'][0]['release_date']

            # Convert release date to a more readable format (e.g., "25 January, 2023")
            release_date = datetime.strptime(release_date_str, '%Y-%m-%d')
            formatted_release_date = release_date.strftime('%d %B, %Y')

            # Compare release date with the current date
            current_date = datetime.now()

            if release_date <= current_date:
                response_message = f"The movie \"{movie_title}\" was released on {formatted_release_date}."
            else:
                response_message = f"The movie \"{movie_title}\" is yet to be released and will be released on {formatted_release_date}."

            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionIsGoodOrBad(Action):
    def name(self) -> Text:
        return "action_is_good_or_bad"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its details
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(search_url, **options)
        search_results = response.json()

        if 'results' in search_results and search_results['results']:
            # Get the vote average of the first movie in the search results
            vote_average = search_results['results'][0]['vote_average']

            # Determine if the movie is considered good or bad based on the rating
            rating_comment = self.get_rating_comment(vote_average)

            # Create a response for the bot
            response_message = f"The rating of {movie_title} is: {round(vote_average, 2)}/10. {rating_comment}"
            dispatcher.utter_message(response_message)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []

    def get_rating_comment(self, rating: float) -> Text:
        if rating <= 3:
            return "It's considered very bad."
        elif 3 < rating <= 4:
            return "It's below average."
        elif 4 < rating <= 6:
            return "It's average."
        elif 6 < rating <= 7:
            return "It's above average."
        elif 7 < rating <= 8:
            return "It's good."
        elif 8 < rating <= 9:
            return "It's very good."
        elif 9 < rating <= 10:
            return "It's excellent."
        else:
            return "The rating is not within the expected range."


class ActionWhetherMovieHasCast(Action):
    def name(self) -> Text:
        return "action_whether_movie_has_cast"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Get cast name from user input
            cast_name = tracker.get_slot("cast_name")
            if not cast_name:
                dispatcher.utter_message("I'm sorry, I couldn't find a cast name in your query.")
                return []

            # Search for cast details using the cast name
            cast_search_url = f'https://api.themoviedb.org/3/search/multi?query={cast_name}'
            cast_search_response = requests.get(cast_search_url, **search_options)
            cast_search_results = cast_search_response.json()

            if 'results' in cast_search_results and cast_search_results['results']:
                # Extract cast ID from the search results
                cast_id = cast_search_results['results'][0]['id']

                # Use TMDb API to get credits of the movie
                credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
                credits_response = requests.get(credits_url, **search_options)
                credits_data = credits_response.json()

                # Check if the cast with the given ID is in the movie's cast
                movie_cast = credits_data.get('cast', [])
                matching_cast = [cast for cast in movie_cast if cast.get('id') == cast_id]

                if matching_cast:
                    # Extract details of the matching cast member
                    matched_cast_member = matching_cast[0]
                    original_name = matched_cast_member.get('original_name', 'N/A')
                    character_name = matched_cast_member.get('character', 'N/A')
                    gender = matched_cast_member.get('gender', 0)

                    gender_name = "Male" if gender == 2 else "Female" if gender == 1 else "N/A"
                    response_message = f"Yes, {movie_title} has the cast:"
                    response_message += f"\n- {original_name} as {character_name} ({gender_name})"
                    dispatcher.utter_message(response_message)
                else:
                    dispatcher.utter_message(
                        f"The cast member with the name {cast_name} is not found in {movie_title}.")
            else:
                dispatcher.utter_message(f"Sorry, I couldn't find any information about the cast member {cast_name}.")
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionWhetherMovieHasDirector(Action):
    def name(self) -> Text:
        return "action_whether_movie_has_director"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its ID
        search_url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        search_options = {
            'headers': headers
        }

        search_response = requests.get(search_url, **search_options)
        search_results = search_response.json()

        if 'results' in search_results and search_results['results']:
            # Get the ID of the first movie in the search results
            movie_id = search_results['results'][0]['id']

            # Get cast name from user input
            director_name = tracker.get_slot("cast_name")
            if not director_name:
                dispatcher.utter_message("I'm sorry, I couldn't find a director name in your query.")
                return []

            # Search for cast details using the cast name
            director_search_url = f'https://api.themoviedb.org/3/search/multi?query={director_name}'
            director_search_response = requests.get(director_search_url, **search_options)
            director_search_results = director_search_response.json()

            # Check if there is a person in the results
            first_person = director_search_results.get("results", [])[0]

            if first_person:
                # Get the top 2 titles from the known_for array
                top_2_titles = [movie["title"] for movie in first_person.get("known_for", [])[:2]]
                # Store top 2 movies in a string
                top_2_movies_string = ', '.join(top_2_titles)
            if 'results' in director_search_results and director_search_results['results']:
                # Extract cast ID from the search results
                director_id = director_search_results['results'][0]['id']

                # Use TMDb API to get credits of the movie
                credits_url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
                credits_response = requests.get(credits_url, **search_options)
                credits_data = credits_response.json()

                # Check if the cast with the given ID is in the movie's cast
                movie_director = credits_data.get('crew', [])
                matching_crew = [crew for crew in movie_director if
                                 crew.get('id') == director_id and crew.get('job') == 'Director']

                if matching_crew:
                    # Extract details of the matching cast member
                    matched_cast_member = matching_crew[0]
                    original_name = matched_cast_member.get('original_name', 'N/A')

                    response_message = f"Yes, {movie_title} directed by:"
                    response_message += f"\n- {original_name}"
                    response_message += f" Top 2 Movies of {original_name} are: {top_2_movies_string}"
                    dispatcher.utter_message(response_message)
                else:
                    dispatcher.utter_message(
                        f"The director with the name {director_name} is not the director of {movie_title}.")
            else:
                dispatcher.utter_message(
                    f"Sorry, I couldn't find any information about the cast member {director_name}.")
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the movie {movie_title}.")

        return []


class ActionIsMovieGenres(Action):
    def name(self) -> Text:
        return "action_whether_movie_has_genre"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # Get movie title from user input
        movie_title = tracker.get_slot("movie_title")
        if not movie_title:
            dispatcher.utter_message("I'm sorry, I couldn't find a movie title in your query.")
            return []

        # Use TMDb API to search for the movie and get its genres
        url = f'https://api.themoviedb.org/3/search/movie?query={movie_title}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        search_results = response.json()

        movie_genres = {
            28: "action",
            12: "adventure",
            16: "animation",
            35: "comedy",
            80: "crime",
            99: "documentary",
            18: "drama",
            10751: "family",
            14: "fantasy",
            36: "history",
            27: "horror",
            10402: "music",
            9648: "mystery",
            10749: "romance",
            878: "science fiction",
            10770: "tv movie",
            53: "thriller",
            10752: "war",
            37: "western"
        }

        genre_name = tracker.get_slot("genre")
        if not genre_name:
            dispatcher.utter_message("I'm sorry, I couldn't find a genre in your query.")
            return []

        # Convert genre name to lowercase for case-insensitive comparison
        lowercase_genre_name = genre_name.lower()

        # Search for the genre ID ignoring case
        matching_genre_ids = [genre_id for genre_id, genre in movie_genres.items() if
                              genre.lower() == lowercase_genre_name]

        if matching_genre_ids:
            # Use the first matching genre ID (assuming unique genre names)
            selected_genre_id = matching_genre_ids[0]

            if 'results' in search_results and search_results['results']:
                # Get the genre IDs of the first movie in the search results
                genre_ids = search_results['results'][0].get('genre_ids', [])
                # Check if selected_genre_id is present in genre_ids
                if selected_genre_id in genre_ids:
                    dispatcher.utter_message(
                        f"The movie with the selected genre '{movie_genres[selected_genre_id]}' was found.")
                else:
                    dispatcher.utter_message(
                        f"The movie does not have the selected genre '{movie_genres[selected_genre_id]}'.")
        else:
            dispatcher.utter_message(f"I'm sorry, I couldn't find a genre ID for '{genre_name}'.")

        return []


class ActionTellMeAboutCast(Action):
    def name(self) -> Text:
        return "action_details_of_cast_n_crew"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        # Get cast name from user input
        cast_name = tracker.get_slot("cast_name")
        if not cast_name:
            dispatcher.utter_message("I'm sorry, I couldn't find a cast name in your query.")
            return []

        # Make API request to get details about the cast
        url = f"https://api.themoviedb.org/3/search/multi?query={cast_name}"
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        options = {
            'headers': headers
        }

        response = requests.get(url, **options)
        cast_details = response.json()

        if 'results' in cast_details and cast_details['results']:
            # Extract details of the first result (assuming it's the most relevant)
            cast_info = cast_details['results'][0]

            # Extract relevant information
            original_name = cast_info.get('original_name', 'N/A')
            gender = cast_info.get('gender', 'N/A')
            known_for_department = cast_info.get('known_for_department', 'N/A')

            # Map gender values to 'female' or 'male'
            gender_mapping = {1: 'female', 2: 'male'}
            gender_str = gender_mapping.get(gender, 'N/A')

            # Create a string with basic details about the cast
            cast_details_string = f"Details about {original_name}:\n"
            cast_details_string += f"Gender: {gender_str}\n"
            cast_details_string += f"Known For Department: {known_for_department}\n"

            # Extract details from the 'known_for' array
            known_for_movies = cast_info.get('known_for', [])
            for movie in known_for_movies:
                title = movie.get('title', 'N/A')
                overview = movie.get('overview', 'N/A')

                # Add details of each movie to the string
                cast_details_string += f"\nMovie: {title}\nOverview: {overview}\n"

            # Send the constructed message to the user
            dispatcher.utter_message(cast_details_string)
        else:
            dispatcher.utter_message(f"Sorry, I couldn't find any information about the cast member {cast_name}.")

        return []
