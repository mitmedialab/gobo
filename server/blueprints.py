from flask import Blueprint


def _factory(partial_module_string, url_prefix):
    """Generates blueprint objects for view modules.
    Positional arguments:
    partial_module_string -- string representing a view module without the absolute path (e.g. 'home.index' for
        pypi_portal.views.home.index).
    url_prefix -- URL prefix passed to the blueprint.
    Returns:
    Blueprint instance for a view module.
    """
    name = partial_module_string
    import_name = 'server.views.{}'.format(partial_module_string)
    blueprint = Blueprint(name, import_name,  url_prefix=url_prefix)
    return blueprint


home = _factory('home', '')
api = _factory('api', '/api')


all_blueprints = (home, api)