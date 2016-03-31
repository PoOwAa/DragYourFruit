from django.conf.urls import url

from .views import IndexView

app_name = 'dyf'
urlpatterns = [
    #/
    url(r'^', IndexView.as_view(), name='indexUrl'),
]