# The templates directory is different between dev and prod. This string template can be imported directly.
FORGOT_PASSWORD = """
You requested that your Gobo account password be reset.

Please visit the link below within 24 hours to reset your password:

{{ password_reset_url }}

Questions? Comments? Email gobo@media.mit.edu.
"""
