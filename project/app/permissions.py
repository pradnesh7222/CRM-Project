from rest_framework import permissions
import logging
from .models import Users
logger = logging.getLogger(__name__)

class RoleBasedPermission(permissions.BasePermission):
    """
    Custom permission to check role-based access control using the Roles model.
    """
    print("!")
    def has_permission(self, request, view):
        # Check if the user is authenticated
        print(request.user)

        try:
            # Access the user's role from the profile
            print(request.user)
            user = Users.objects.get(id=1) # Directly access `role` field in Users model
            print(user.role)
            logger.debug(f"User role: {user.role}")
            print("User role",user.role)
        except AttributeError:
            logger.debug("User does not have a role assigned")
            return False

        # Retrieve permissions from the user's role
        permissions = user.role.permissions or {}  # Ensure permissions is a dictionary
        logger.debug(f"User permissions: {permissions}")

        # Map HTTP methods to action keys in the permissions JSON
        method_permission_map = {
            'POST': 'create',
            'GET': 'read',
            'PUT': 'update',
            'PATCH': 'update',
            'DELETE': 'delete'
        }

        # Get the relevant action based on the HTTP method
        action = method_permission_map.get(request.method)
        if action:
            return permissions.get(action, False)  # Return True if permission is granted
        else:
            logger.debug(f"No permission mapped for HTTP method {request.method}")
            return False
