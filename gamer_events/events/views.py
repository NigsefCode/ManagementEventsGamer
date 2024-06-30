from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .models import User, Event, Team, Participation, Category
from .serializers import UserSerializer, EventSerializer, TeamSerializer, ParticipationSerializer, CategorySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from bson import ObjectId
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import render
from djongo.models import Count
from pymongo import MongoClient
from bson import ObjectId
from django.conf import settings
from django.http import JsonResponse

class UserViewSet(ModelViewSet):
    """
    Viewset for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_details(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    data = {
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
    }
    return Response(data)


class CategoryViewSet(ModelViewSet):
    """
    Viewset for managing categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

class EventViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing events.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned events to a given user and category,
        by filtering against `creator` and `category` query parameters in the URL.
        """
        queryset = super().get_queryset()
        user = self.request.user
        category_id = self.request.query_params.get('category', None)

        if self.action == 'my_events':
            queryset = queryset.filter(creator=user.id)
        if category_id:
            try:
                # Convert the category_id to an integer
                category_id = int(category_id)
                queryset = queryset.filter(category__id=category_id)
            except (TypeError, ValueError):
                queryset = queryset.none()  # Invalid integer format

        return queryset

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_events(self, request):
        """
        Returns the events created by the logged-in user.
        """
        events = self.get_queryset().filter(creator=request.user.id)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """
        Automatically assigns the authenticated user as the creator of the event.
        """
        serializer.save(creator=self.request.user)

    def destroy(self, request, *args, **kwargs):
        """
        Allows a user to delete an event only if they are the creator.
        """
        instance = self.get_object()
        if instance.creator != request.user:
            return Response({'error': 'You do not have permission to delete this event.'}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class TeamViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing teams.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_teams(self, request):
        """
        Returns the teams that the logged-in user created.
        """
        teams = Team.objects.filter(creator=request.user)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
    
class ParticipateEventView(generics.CreateAPIView):
    queryset = Participation.objects.all()
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UserParticipationListView(generics.ListAPIView):
    serializer_class = ParticipationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Participation.objects.filter(user=self.request.user)

class ParticipateEventDeleteView(generics.DestroyAPIView):
    queryset = Participation.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    

@api_view(['POST'])
def register_user(request):
    """
    API endpoint for registering a new user.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['user_id'] = str(user.id)
        token['username'] = user.username
        token['is_superuser'] = user.is_superuser
        token['is_staff'] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user_id'] = self.user.id
        data['is_superuser'] = self.user.is_superuser
        data['is_staff'] = self.user.is_staff
        return data
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def popular_events(request):
    try:
        client = MongoClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_NAME]
        events_collection = db['events_event']

        pipeline = [
            {
                "$lookup": {
                    "from": "events_participation",
                    "localField": "id",
                    "foreignField": "event_id",
                    "as": "participations"
                }
            },
            {
                "$addFields": {
                    "participants_count": {"$size": "$participations"}
                }
            },
            {
                "$sort": {"participants_count": -1}
            },
            {
                "$limit": 10
            },
            {
                "$project": {
                    "name": 1,
                    "participants_count": 1
                }
            }
        ]

        popular_events = list(events_collection.aggregate(pipeline))

        # Convertir ObjectId a string
        for event in popular_events:
            event['_id'] = str(event['_id'])


        return Response(popular_events)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_roles_distribution(request):
    try:
        # Conectar a la base de datos MongoDB
        client = MongoClient(settings.MONGODB_URI)
        db = client[settings.MONGODB_NAME]
        users_collection = db['events_user']

        # Definir el pipeline de agregación para contar roles
        role_distribution_pipeline = [
            {
                "$group": {
                    "_id": {
                        "is_superuser": "$is_superuser",
                        "is_staff": "$is_staff"
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "role": {
                        "$cond": {
                            "if": {"$eq": ["$_id.is_superuser", True]},
                            "then": "Admin",
                            "else": {
                                "$cond": {
                                    "if": {"$eq": ["$_id.is_staff", True]},
                                    "then": "Staff",
                                    "else": "User"
                                }
                            }
                        }
                    },
                    "count": 1
                }
            }
        ]

        # Ejecutar el pipeline de agregación
        role_distribution = list(users_collection.aggregate(role_distribution_pipeline))

        # Calcular el total de usuarios
        total_users = sum(role['count'] for role in role_distribution)

        # Estructurar la respuesta
        response_data = {
            "total_users": total_users,
            "roles": role_distribution
        }

        return JsonResponse(response_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
