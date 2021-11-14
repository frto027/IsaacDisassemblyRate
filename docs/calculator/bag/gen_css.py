output = ""

for i in range(27):
    output += """
.bofsym_%d{
    width: 16px;
    height: 16px;
    background: url("Bag_of_Crafting_UI_symbols.png") -%dpx -%dpx;
}""" % (i,(i % 8) * 16,(i // 8)*16)
print(output)