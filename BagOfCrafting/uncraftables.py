# this script print uncraftable items

import xml.etree.ElementTree as ET

itempool = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\itempools.xml'
items_metadata = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\items_metadata.xml'
items = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources-dlc3\items.xml'
strinttables = r'D:\SteamLibrary\steamapps\common\The Binding of Isaac Rebirth\resources\stringtable.sta'

lang_index = 3 # language index in stringtable.sta

string_table = {}
with open(strinttables,'rb') as f:
    strinttables = f.read().decode('utf8')
strinttables = ET.fromstring(strinttables)
assert strinttables.tag == 'stringtable'
for category in strinttables:
    if category.tag == 'category' and category.attrib['name'] == 'Items':
        for key in category:
            if key.tag == 'key':
                string = key[lang_index]
                assert string.tag == 'string'
                string_table[f'#{key.attrib["name"]}']=string.text

item_ids = {}

with open(items,'rb') as f:
    items = f.read().decode('utf8')
items = ET.fromstring(items)
assert items.tag == 'items'

for item in items:
    if item.tag in ['passive','active','familiar']:
        name = item.attrib["name"]
        assert name in string_table
        name = string_table[name]
        item_ids[item.attrib["id"]] = name

with open(itempool,'rb') as f:
    itempool = f.read().decode('utf8')

itempool = ET.fromstring(itempool)

assert itempool.tag == 'ItemPools'

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

removed_names = set()

for pool in itempool:
    assert pool.tag == 'Pool'
    if pool.attrib["Name"] in pools_gen.keys():
        for item in pool:
            assert item.tag == 'Item'
            id = item.attrib["Id"]
            if id in item_ids:
                removed_names.add(item_ids[id])
                item_ids.pop(id)

def remove_item(x):
    if x in item_ids:
        item_ids.pop(x)

remove_item('59')
remove_item('656')

for name in item_ids.values():
    if(name in removed_names):
        print(f'please check {name}')

print("uncraftable items:")
for name in item_ids.values():
    print(f'{name},',end='')
