#! python3

from bs4 import BeautifulSoup
import webbrowser, sys, pyperclip, requests

if len(sys.argv) > 1:
    # get address from command line
    address = sys.argv[1]
else:
    # get address from clipboard
    address = pyperclip.paste()

# Get html from web address
print("Getting data from: {}".format(address))
response = requests.get(address)

# Parse data
content = BeautifulSoup(response.content, "html.parser")

# Find categories and create objects
categories = content.find('select', attrs={"id": "categories"}).findAll('option')
categoriesArr = []
for category in categories:
    categoryObj = {
        "id": category['value'],
        "description": ' '.join(category.text.split())
    }
    categoriesArr.append(categoryObj)
print(categoriesArr)

# Find data types and create objects
# Below code doesn't work (yet)
dataTypes = content.find('select', attrs={"id": "dataType"})#.findAll('option')
print(dataTypes)
dataTypesArr = []
for dataType in dataTypes:
    dataTypeObj = {
        "id": dataType['value'],
        "description": ' '.join(dataType.text.split())
    }
    dataTypesArr.append(dataTypeObj)
print(dataTypesArr)
