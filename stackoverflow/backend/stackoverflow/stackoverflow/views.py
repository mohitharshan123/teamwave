import requests
from django.conf import settings
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.views import APIView


class SearchQuestion(APIView):
    
    @method_decorator(cache_page(60*100))                                                   
    def get(self, request):
        base_url = settings.STACK_API_BASE_URL
        stack_api_response = requests.get(base_url, params=request.query_params)
        search_results = stack_api_response.json()
        return JsonResponse(search_results)
