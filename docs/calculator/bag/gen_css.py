output = ""

for i in range(31):
    output += """
.bofsym_%d{
    width: 16px;
    height: 16px;
    background: url("ui_crafting.png") -%dpx -%dpx;
}""" % (i,(i % 8) * 16,(i // 8)*16)
print(output)