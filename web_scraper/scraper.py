#! python3

from selenium import webdriver
from bs4 import BeautifulSoup
import webbrowser, sys, pyperclip, time, json

if len(sys.argv) > 1:
    # get table name from command line
    tableName = sys.argv[1]

# get address from clipboard
address = pyperclip.paste()

# Get html from web address
print("Getting data from: {}".format(address))
browser = webdriver.Firefox()
browser.get(address)
time.sleep(1)

# Parse data
content = BeautifulSoup(browser.page_source, "html.parser")

# Find categories and create objects
categories = content.find('select', attrs={"id": "categories"}).findAll('option')
categoriesArr = []
for category in categories:
    categoryObj = {
        "id": category['value'],
        "description": ' '.join(category.text.split())
    }
    categoriesArr.append(categoryObj)
    print(categoryObj)
print(categoriesArr)
categoriesObj = {
    "category_code": categoriesArr
}

# Find data types and create objects
dataTypes = content.find('select', attrs={"id": "dataType"})#.findAll('option')
print(dataTypes)
dataTypesArr = []
for dataType in dataTypes:
    dataTypeObj = {
        "id": dataType['value'],
        "description": ' '.join(dataType.text.split())
    }
    dataTypesArr.append(dataTypeObj)
    print(dataTypeObj)
print(dataTypesArr)
dataTypesObj = {
    "data_type_code": dataTypesArr
}

# Find data types and create objects
geoLevels = content.find('select', attrs={"id": "geoLevel"})#.findAll('option')
print(geoLevels)
geoLevelsArr = []
for geoLevel in geoLevels:
    geoLevelObj = {
        "id": geoLevel['value'],
        "description": ' '.join(geoLevel.text.split())
    }
    geoLevelsArr.append(geoLevelObj)
    print(geoLevelObj)
print(geoLevelsArr)
geoLevelsObj = {
    "geo_level_code": geoLevelsArr
}

browser.quit()

tableObj = {
    tableName:
    [
        categoriesObj,
        dataTypesObj,
        geoLevelsObj
    ]
}

# Write data to JSON file
with open('../apiJsons/' + tableName + '.json', 'a+') as outfile:
    json.dump(tableObj, outfile)