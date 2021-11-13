import xml.etree.ElementTree as ET

itempool = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\itempools.xml'
items_metadata = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\items_metadata.xml'

with open(itempool,'rb') as f:
    itempool = f.read().decode('utf8')

itempool = ET.fromstring(itempool)

assert itempool.tag == 'ItemPools'

output = ''

pools_gen = {
    "treasure":0,
    "shop":1,
    "boss":2,
    "devil":3,
    "angel":4,
    "secret":5,
    "shellGame":7,
    "goldenChest":8,
    "redChest":9,
    "curse":12,
    "planetarium":26,
}

prettyprint = True

output += "let item_pool_data = {"
if prettyprint:
    output += "\n"

for pool in itempool:
    assert pool.tag == "Pool"
    poolname = pool.attrib['Name']
    if poolname in pools_gen:

        if prettyprint:
            output += "    "
        output += f"{pools_gen[poolname]}:["
        if prettyprint:
            output += "\n"

        for item in pool:
            assert item.tag == "Item"
            if prettyprint:
                output += "        "
            output += "{" + f"id:{item.attrib['Id']},weight:{item.attrib['Weight']}" + "},"
            if prettyprint:
                output += "\n"

        if prettyprint:
            output += "    "
        output += "],\n"

output += "}\n"

with open(items_metadata, 'rb') as f:
    items_metadata = f.read().decode('utf8')
items_metadata = ET.fromstring(items_metadata)
assert items_metadata.tag == 'items'

output += "let item_config_data = {"
if prettyprint:
    output += "\n"

for item in items_metadata:
    if item.tag == 'item' :
        if prettyprint:
            output += "    "
        output += item.attrib['id'] + ':{quality:' + item.attrib['quality'] + '},'
        if prettyprint:
            output += "\n"
output += "}\n"




output += """
module.exports = {
    item_pool_data:item_pool_data,
    item_config_data:item_config_data
}
"""


with open('datas.js','wb') as f:
    f.write(output.encode('utf8'))