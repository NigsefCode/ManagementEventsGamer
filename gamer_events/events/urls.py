from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

# Creamos un enrutador de DRF y registramos nuestras vistas de conjuntos
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'events', EventViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'categories', CategoryViewSet)  # Registro de la vista de categorías

urlpatterns = [
    path('', include(router.urls)),  # Incluimos las rutas del enrutador
    path('register/', register_user, name='register'),  # Ruta para registrar usuarios
    path('users/<int:user_id>/', user_details, name='user-details'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Ruta para obtener el token JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Ruta para refrescar el token JWT

    # Rutas para la participación en eventos
    path('participate/', ParticipateEventView.as_view(), name='participate_event'),
    path('my-participations/', UserParticipationListView.as_view(), name='user_participations'),
    path('participate/<int:pk>/', ParticipateEventDeleteView.as_view(), name='participate-delete'),

    # Rutas a las integraciones con Pipeline en MongoDB
    path('popular-events/', popular_events, name='popular-events'),
    path('user-roles-distribution/', user_roles_distribution, name='user-roles-distribution'),
]
