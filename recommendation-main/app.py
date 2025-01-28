# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import pandas as pd
# import pickle
# import requests
#
# app = Flask(__name__)
# CORS(app)
# # Load preprocessed data from Pickle files
# movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
# new_merge_df = pd.DataFrame(movies_dict)
#
# # with open('similarity.pkl', 'rb') as file:
# #     similarity = pickle.load(file)
#
#
# # splitted similarity and merged as pythonanywhere do not allows to upload files larger than 100mb
# # Load movie data
# movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
# new_merge_df = pd.DataFrame(movies_dict)
#
#
# # Function to load and merge similarity data
# def load_and_merge_similarity(file1, file2):
#     with open(file1, 'rb') as f1:
#         data1 = pickle.load(f1)
#
#     with open(file2, 'rb') as f2:
#         data2 = pickle.load(f2)
#
#     # Combining the data from both files
#     merged_data = data1 + data2
#     return merged_data
#
#
# # Example usage:
# file1 = 'part1.pkl'
# file2 = 'part2.pkl'
#
# similarity = load_and_merge_similarity(file1, file2)
#
#
# # Function to recommend movies based on title
# def rcmnd(movie):
#     movie_row = new_merge_df[new_merge_df['title'] == movie]
#     recommended_movies = []
#     if len(movie_row) == 0:
#         return recommended_movies
#
#     mov_ind = movie_row.index[0]
#     dist = similarity[mov_ind]
#     mov_list = sorted(list(enumerate(dist)), reverse=True, key=lambda x: x[1])[1:6]
#
#     for i in mov_list:
#         recommended_movies.append({
#             "title": new_merge_df.iloc[i[0]]['title'],
#             "index": i[0]
#         })
#
#     return recommended_movies
#
#
# def recommend_movies(movie_ids):
#     # Function to fetch top movie for a given name
#     def fetch_top_movie(name):
#         url = f'https://api.themoviedb.org/3/search/multi?query={name}&page=1'
#         headers = {
#             'accept': 'application/json',
#             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
#         }
#
#         response = requests.get(url, headers=headers)
#
#         if response.status_code == 200:
#             result = response.json()
#             if result.get('results'):
#                 top_movie = result['results'][0]  # Take the first movie from the search results
#                 if top_movie.get('known_for') and len(top_movie['known_for']) > 0:
#                     movie_info = top_movie['known_for'][0]  # Retrieve the first known movie
#                     return {
#                         "id": movie_info.get("id"),
#                         "title": movie_info.get("title") or movie_info.get("name")  # Get movie title
#                     }
#         return None
#
#     # Function to fetch top movies for all cast members and director
#     def fetch_top_movies_caller(cast_members):
#         top_movies = []
#
#         for member in cast_members:
#             top_movie = fetch_top_movie(member["name"])
#             if top_movie:
#                 top_movies.append(top_movie)
#
#         return top_movies
#
#     final_cast = []
#
#     for movie_id in movie_ids:
#         url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
#         headers = {
#             'accept': 'application/json',
#             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
#         }
#
#         response = requests.get(url, headers=headers)
#
#         if response.status_code == 200:
#             api_response = response.json()
#
#             # Extracting top two cast members
#             cast_members = []
#             for member in api_response["cast"]:
#                 if member["known_for_department"] == "Acting" and len(cast_members) < 2:
#                     cast_members.append({
#                         "id": member["id"],
#                         "name": member["name"]
#                     })
#
#             # Extract director from crew
#             for crew_member in api_response["crew"]:
#                 if crew_member.get("job") == "Director":
#                     cast_members.append({
#                         "id": crew_member["id"],
#                         "name": crew_member["name"]
#                     })
#                     break  # Stop searching once director is found
#
#             final_cast.extend(cast_members)
#
#     final_top_movie = fetch_top_movies_caller(final_cast)
#     return final_top_movie
#
#
# def get_tmdb_recommendations(movie_list):
#     def fetch_movie_recommendations(movie_id):
#         url = f'https://api.themoviedb.org/3/movie/{movie_id}/recommendations?page=1'
#         headers = {
#             'accept': 'application/json',
#             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
#         }
#
#         response = requests.get(url, headers=headers)
#         if response.status_code == 200:
#             api_response = response.json()
#             # Extracting 'id' and 'title' from the first 6 results
#             extracted_data = [{'id': movie['id'], 'title': movie['title']} for movie in api_response['results'][:6]]
#             return extracted_data
#         else:
#             return None
#
#     recommendations = []
#     for movie in movie_list:
#         movie_id = movie.get('id')
#         movie_title = movie.get('title')
#         recommendations3 = fetch_movie_recommendations(movie_id)
#         recommendations.extend(recommendations3)
#
#     return recommendations
#
#
# def movie_details_fill(recommend_movies):
#     def fetch_movie_details(movie_id):
#         url = f'https://api.themoviedb.org/3/movie/{movie_id}'
#         headers = {
#             'accept': 'application/json',
#             'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
#         }
#
#         response = requests.get(url, headers=headers)
#         if response.status_code == 200:
#             movie_details = response.json()
#             genres = [genre['id'] for genre in movie_details.get('genres', [])]
#             language = movie_details.get('original_language')
#             return {'genres': genres, 'language': language}
#         else:
#             return None
#
#     for movie in recommend_movies:
#         movie_id = movie.get('id')
#         movie_title = movie.get('title')
#         if movie_id:
#             details = fetch_movie_details(movie_id)
#             if details:
#                 movie.update(details)
#
#     return recommend_movies
#
#
# # Flask endpoint to recommend movies
# @app.route('/api/recommend_movies', methods=['POST'])
# def recommend_movies_endpoint():
#     try:
#         data = request.json
#         movie_list = data.get('movies', [])
#         print(movie_list)
#         lang_pref = data.get('langPref', [])  # Language preferences from request body
#         print(lang_pref)
#         genre_pref = data.get('genrePref', [])  # Genre preferences from request body
#         print(genre_pref)
#         recommended_movies = []
#         movie_ids = []
#
#         for movie in movie_list:
#             movie_title = movie.get('title')
#             recommendations1 = rcmnd(movie_title)
#             recommended_movies.extend(recommendations1)
#
#         for movie in movie_list:
#             movie_id = movie.get('id')
#             movie_ids.append(movie_id)
#
#         recommendations2 = get_tmdb_recommendations(movie_list)
#         recommended_movies.extend(recommendations2)
#
#         recommendations3 = recommend_movies(movie_ids)
#         recommended_movies.extend(recommendations3)
#
#         response_list = movie_details_fill(recommended_movies)
#
#         # Apply sorting based on user preferences
#         def similarity_score(movie):
#             # Calculate similarity score based on language and genres
#             lang_similarity = 1 if movie['language'] in lang_pref else 0
#             genre_similarity = len(set(movie['genres']).intersection(genre_pref))
#             return lang_similarity + genre_similarity
#
#         # Sort response list based on similarity score
#         response_list.sort(key=similarity_score, reverse=True)
#
#         unique_ids = set()
#         response_list = [d for d in response_list if not (d['id'] in unique_ids or unique_ids.add(d['id']))]
#         response_list = [d for d in response_list if str(d['id']) not in movie_ids]
#
#         # Pagination
#         page = int(request.args.get('page', 1))
#         items_per_page = 10
#         total_results = len(response_list)
#         total_pages = -(-total_results // items_per_page)  # Ceiling division to calculate total pages
#         start_index = (page - 1) * items_per_page
#         end_index = min(start_index + items_per_page, total_results)
#
#         paginated_response = response_list[start_index:end_index]
#
#         return jsonify({
#             "results": paginated_response,
#             "total_results": total_results,
#             "total_pages": total_pages
#         }), 200
#
#     except Exception as e:
#         print('error in language',str(e))
#         error_message = str(e)
#         return jsonify({"error": error_message}), 500
#
#
#
# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import pickle
import requests

app = Flask(__name__)
CORS(app)
# Load preprocessed data from Pickle files
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
new_merge_df = pd.DataFrame(movies_dict)

# with open('similarity.pkl', 'rb') as file:
#     similarity = pickle.load(file)


# splitted similarity and merged as pythonanywhere do not allows to upload files larger than 100mb
# Load movie data
movies_dict = pickle.load(open('movie_dict.pkl', 'rb'))
new_merge_df = pd.DataFrame(movies_dict)


# Function to load and merge similarity data
def load_and_merge_similarity(file1, file2):
    with open(file1, 'rb') as f1:
        data1 = pickle.load(f1)

    with open(file2, 'rb') as f2:
        data2 = pickle.load(f2)

    # Combining the data from both files
    merged_data = data1 + data2
    return merged_data


# Example usage:
file1 = 'part1.pkl'
file2 = 'part2.pkl'

similarity = load_and_merge_similarity(file1, file2)


# Function to recommend movies based on title
def rcmnd(movie):
    movie_row = new_merge_df[new_merge_df['title'] == movie]
    recommended_movies = []
    if len(movie_row) == 0:
        return recommended_movies

    mov_ind = movie_row.index[0]
    dist = similarity[mov_ind]
    mov_list = sorted(list(enumerate(dist)), reverse=True, key=lambda x: x[1])[1:6]

    for i in mov_list:
        recommended_movies.append({
            "title": new_merge_df.iloc[i[0]]['title'],
            "index": i[0]
        })

    return recommended_movies


def recommend_movies(movie_ids):
    # Function to fetch top movie for a given name
    def fetch_top_movie(name):
        url = f'https://api.themoviedb.org/3/search/multi?query={name}&page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            result = response.json()
            if result.get('results'):
                top_movie = result['results'][0]  # Take the first movie from the search results
                if top_movie.get('known_for') and len(top_movie['known_for']) > 0:
                    movie_info = top_movie['known_for'][0]  # Retrieve the first known movie
                    return {
                        "id": movie_info.get("id"),
                        "title": movie_info.get("title") or movie_info.get("name")  # Get movie title
                    }
        return None

    # Function to fetch top movies for all cast members and director
    def fetch_top_movies_caller(cast_members):
        top_movies = []

        for member in cast_members:
            top_movie = fetch_top_movie(member["name"])
            if top_movie:
                top_movies.append(top_movie)

        return top_movies

    final_cast = []

    for movie_id in movie_ids:
        url = f'https://api.themoviedb.org/3/movie/{movie_id}/credits'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            api_response = response.json()

            # Extracting top two cast members
            cast_members = []
            for member in api_response["cast"]:
                if member["known_for_department"] == "Acting" and len(cast_members) < 2:
                    cast_members.append({
                        "id": member["id"],
                        "name": member["name"]
                    })

            # Extract director from crew
            for crew_member in api_response["crew"]:
                if crew_member.get("job") == "Director":
                    cast_members.append({
                        "id": crew_member["id"],
                        "name": crew_member["name"]
                    })
                    break  # Stop searching once director is found

            final_cast.extend(cast_members)

    final_top_movie = fetch_top_movies_caller(final_cast)
    return final_top_movie


def get_tmdb_recommendations(movie_list):
    def fetch_movie_recommendations(movie_id):
        url = f'https://api.themoviedb.org/3/movie/{movie_id}/recommendations?page=1'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            api_response = response.json()
            # Extracting 'id' and 'title' from the first 6 results
            extracted_data = [{'id': movie['id'], 'title': movie['title']} for movie in api_response['results'][:6]]
            return extracted_data
        else:
            return None

    recommendations = []
    for movie in movie_list:
        movie_id = movie.get('id')
        movie_title = movie.get('title')
        recommendations3 = fetch_movie_recommendations(movie_id)
        recommendations.extend(recommendations3)

    return recommendations


def movie_details_fill(recommend_movies):
    def fetch_movie_details(movie_id):
        url = f'https://api.themoviedb.org/3/movie/{movie_id}'
        headers = {
            'accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOTllMjk5ZDI4NmUxMGVlMmY5MTA4YWMyOTA2MGQ0MiIsInN1YiI6IjY1ODY4MDc2NTk2YTkxNWUxNTQwNGM3YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UHP_AriZhZ3iJcrvCpSi1x1pPJoEhO8wqDC2vM18gZA'
        }

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            movie_details = response.json()
            genres = [genre['id'] for genre in movie_details.get('genres', [])]
            language = movie_details.get('original_language')
            return {'genres': genres, 'language': language}
        else:
            return None

    for movie in recommend_movies:
        movie_id = movie.get('id')
        movie_title = movie.get('title')
        if movie_id:
            details = fetch_movie_details(movie_id)
            if details:
                movie.update(details)

    return recommend_movies


# Flask endpoint to recommend movies
@app.route('/api/recommend_movies', methods=['POST'])
def recommend_movies_endpoint():
    try:
        data = request.json
        movie_list = data.get('movies', [])
        lang_pref = data.get('langPref', [])  # Language preferences from request body
        genre_pref = data.get('genrePref', [])  # Genre preferences from request body

        recommended_movies = []
        movie_ids = []

        for movie in movie_list:
            movie_title = movie.get("title")
            recommendations1 = rcmnd(movie_title)
            recommended_movies.extend(recommendations1)

        for movie in movie_list:
            movie_id = movie.get("id")
            movie_ids.append(movie_id)

        recommendations2 = get_tmdb_recommendations(movie_list)
        recommended_movies.extend(recommendations2)

        recommendations3 = recommend_movies(movie_ids)
        recommended_movies.extend(recommendations3)

        response_list = movie_details_fill(recommended_movies)

        # # Apply sorting based on user preferences
        # def similarity_score(movie):
        #     # Calculate similarity score based on language and genres
        #     lang_similarity = 1 if movie['language'] in lang_pref else 0
        #     genre_similarity = len(set(movie['genres']).intersection(genre_pref))
        #     return lang_similarity + genre_similarity

        # # Sort response list based on similarity score
        # response_list.sort(key=similarity_score, reverse=True)

        def similarity_score(movie):
    # Initialize similarity score
            similarity = 0

    # Check if 'language' field is present in the movie data
            if 'language' in movie:
        # Calculate similarity score based on language preference
                lang_similarity = 1 if movie['language'] in lang_pref else 0
                similarity += lang_similarity

    # Check if 'genres' field is present in the movie data
            if 'genres' in movie:
        # Calculate similarity score based on genre preference
                genre_similarity = len(set(movie['genres']).intersection(genre_pref))
                similarity += genre_similarity

            return similarity

# Sort response list based on similarity score
        response_list.sort(key=similarity_score, reverse=True)


        unique_ids = set()
        response_list = [d for d in response_list if not (d['id'] in unique_ids or unique_ids.add(d['id']))]
        response_list = [d for d in response_list if str(d['id']) not in movie_ids]

        # Pagination
        page = int(request.args.get('page', 1))
        items_per_page = 10
        total_results = len(response_list)
        total_pages = -(-total_results // items_per_page)  # Ceiling division to calculate total pages
        start_index = (page - 1) * items_per_page
        end_index = min(start_index + items_per_page, total_results)

        paginated_response = response_list[start_index:end_index]

        return jsonify({
            "results": paginated_response,
            "total_results": total_results,
            "total_pages": total_pages
        }), 200

    except Exception as e:
        error_message = str(e)
        return jsonify({"error": error_message}), 500



if __name__ == '__main__':
    app.run(debug=True)


