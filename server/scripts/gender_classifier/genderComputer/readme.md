# Gender computer
===

Python tool that tries to infer a person's gender from their `name` (mostly first name) and `location` (country). For example, *Andrea* is a first name typically used by men in *Italy* and women in *Germany*, while *Bogdan* is a first name typically used by men irrespective of the country. Similarly, a *Russian* person called *Anna Akhmatova* is more than likely a woman because of the *-ova* suffix.

### Data provenance

The tool uses lists of `male` and `female` first names for different countries. Whenever available, the data came from national statistics institutes and was accompanied by frequency information. See [this list](https://github.com/tue-mdse/genderComputer/blob/master/nameLists/nameLists.md) for details about the source of data for each country.

The tool also uses the database of first names from all around the world provided together with `gender.c`, an open source C program for name-based gender inference (http://www.heise.de/ct/ftp/07/17/182/). We transform the database (i.e., the `nam_dict.txt` file shipped together with `gender.c`; see the archive on http://www.heise.de/ct/ftp/07/17/182/) into a Python dictionary using the `genderc_python.py` script.


### Dependencies

- `python-nameparser` http://code.google.com/p/python-nameparser/
- `unidecode` https://pypi.python.org/pypi/Unidecode/

### Usage

To use the tool simply create a new `GenderComputer` object and call the `resolveGender` method on a (`name`, `country`) tuple:

```python
from genderComputer import GenderComputer
gc = GenderComputer(os.path.abspath('./nameLists'))

print gc.resolveGender('Alexei Matrosov', 'Russia')
> male

print gc.resolveGender('Matrosov Alexei', 'Russia')
> male

print gc.resolveGender('Bogdan', None)
> male

print gc.resolveGender('w35l3y', 'Brazil')
> male

print gc.resolveGender('Ashley Maher', 'Australia')
> female
```

The tool works well for *clean* names, but may produce unexpected results otherwise:

```python
print gc.resolveGender('jasondavis', 'USA')
> None

print gc.resolveGender('aix', None)
> female
```

### Reporting bugs

Please use the [Issue Tracker](https://github.com/tue-mdse/genderComputer/issues) for reporting bugs and feature requests.

Patches, bug fixes etc are welcome. Please fork the repository and create a pull request when done fixing/implementing the new feature.

### Licenses

- The database is made available under the [Open Database License](http://opendatacommons.org/licenses/odbl/1.0/)
- Any rights in individual contents of the database (i.e., the data) are licensed under the [Database Contents License](http://opendatacommons.org/licenses/dbcl/1.0/)
- The Python tool is licensed under the [GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.txt) version 3
