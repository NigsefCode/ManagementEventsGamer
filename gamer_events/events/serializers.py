from rest_framework import serializers
from .models import User, Event, Team, Participation, Category
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    user_id = serializers.ReadOnlyField(source='id')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'password', 'email', 'is_superuser', 'is_staff', 'user_id']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def validate_is_superuser(self, value):
        user = self.context['request'].user
        if not user.is_superuser:
            raise serializers.ValidationError("No tienes permiso para asignar este rol.")
        return value

    def validate_is_staff(self, value):
        user = self.context['request'].user
        if not user.is_superuser:
            raise serializers.ValidationError("No tienes permiso para asignar este rol.")
        return value

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        else:
            validated_data.pop('password', None)  # Remove password if not provided
        return super(UserSerializer, self).update(instance, validated_data)
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['creator']  # Hacer que el campo creator sea de solo lectura

    def validate_creator(self, value):
        # Este método puede ser utilizado para validar el campo creator si es necesario
        # En este caso, no se necesita una validación específica, así que lo dejamos vacío
        return value

class TeamSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), write_only=True, source='members'
    )

    class Meta:
        model = Team
        fields = ['id', 'name', 'creator', 'members', 'member_ids']

class ParticipationSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    event_id = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all(), write_only=True, source='event')
    team = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all())
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Participation
        fields = ['id', 'event', 'event_id', 'team', 'user']



