//it is not done...
//disassembly from Game


function bucket_sort_list_toint64(item_array){
    //对item_array进行桶排序
    console.assert(item_array.length == 8)

    let item_count = []

    //initial value
    for(let i=0;i<0x1F;i++){
        item_count[i] = 0
    }

    item_count[item_array[0]]++
    item_count[item_array[1]]++
    item_count[item_array[2]]++
    item_count[item_array[3]]++
    item_count[item_array[4]]++
    item_count[item_array[5]]++
    item_count[item_array[6]]++
    item_count[item_array[7]]++

    offset = 0n

    
    v12 = 0n // v12 is 64 bit
    for(let i=0n;i<0x1Fn;i++){
        for(let j=0;j<item_count[i];j++){
            //此代码一定会执行8遍
            v12 |= i << offset
            offset += 8n
        }
    }
    //v12 = 0x08 07 06 05 04 03 02 01
    return v12
}

console.assert(bucket_sort_list_toint64([0x16n,0x2n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n]) == 0x1616161616161602n)

// ===== begin BTree search =====
let btree_nodes = {
    "0B73A168":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C805818", over:true},
    "1C7FDE60":{left:"0B73A168", upper:"1C7FDE98", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x2Dn},
    "1C7FDE28":{left:"1C7FDE98", upper:"0B73A168", right:"1C7FE160", over:false, input:0x0808080808080808n,output:0xB1n},
    "1C805818":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1D1D1D1D1D1D1D1Dn,output:0x24n},
    "1C7FDE98":{left:"1C7FDE60", upper:"1C7FDE28", right:"1C7FD3F8", over:false, input:0x0202020202020202n,output:0x2AEn},
    "1C7FE160":{left:"1C7FE128", upper:"1C7FDE28", right:"1C7FD430", over:false, input:0x1515151515151515n,output:0x55n},
    "1C7FD5F0":{left:"1C7FD5B8", upper:"1C7FD430", right:"1C805818", over:false, input:0x1919191919191919n,output:0x244n},
    "1C7FD3F8":{left:"1C7FE0B8", upper:"1C7FDE98", right:"1C7FD580", over:false, input:0x0404040404040404n,output:0xB6n},
    "1C7FE128":{left:"1C7FE0F0", upper:"1C7FE160", right:"1C7FD510", over:false, input:0x0F0F0F0F0F0F0F0Fn,output:0x25n},
    "1C7FD430":{left:"1C7FD468", upper:"1C7FE160", right:"1C7FD5F0", over:false, input:0x1616161616161616n,output:0x4Bn},
    "1C7FD5B8":{left:"0B73A168", upper:"1C7FD5F0", right:"0B73A168", over:false, input:0x1818181818181818n,output:0x1E9n},
    "1C7FE0B8":{left:"0B73A168", upper:"1C7FD3F8", right:"0B73A168", over:false, input:0x0303030303030303n,output:0x76n},
    "1C7FD580":{left:"1C7FD3C0", upper:"1C7FD3F8", right:"1C7FD4A0", over:false, input:0x0606060606060606n,output:0x274n},
    "1C7FE0F0":{left:"0B73A168", upper:"1C7FE128", right:"1C7FD4D8", over:false, input:0x0C0C0C0C0C0C0C0Cn,output:0x157n},
    "1C7FD510":{left:"1C7FD548", upper:"1C7FE128", right:"0B73A168", over:false, input:0x0101010101010101n,output:0x1E3n},
    "1C7FD468":{left:"0B73A168", upper:"1C7FD430", right:"0B73A168", over:false, input:0x1616161616161603n,output:0x28En},
    "1C7FD3C0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0504040404040201n,output:0x14Bn},
    "1C7FD4A0":{left:"0B73A168", upper:"1C7FD580", right:"0B73A168", over:false, input:0x0707010101010101n,output:0x27Fn},
    "1C7FD4D8":{left:"0B73A168", upper:"1C7FE0F0", right:"0B73A168", over:false, input:0x0D0D0C0C0C0C0C0Cn,output:0xAFn},
    "1C7FD548":{left:"0B73A168", upper:"1C7FD510", right:"0B73A168", over:false, input:0x10100F0F0F0F0F0F,output:0x1E3n},
}

for(address in btree_nodes){
    let node = btree_nodes[address]
    console.assert(btree_nodes[node.left], node.left)
    console.assert(btree_nodes[node.upper], node.upper)
    console.assert(btree_nodes[node.right], node.right)
    // node.address = address
}

let btree = btree_nodes["0B73A168"]
function binary_tree_search_element(sorted_items){
    console.assert(typeof sorted_items == 'bigint')
    let root = btree_nodes[btree.upper]

    let output = {
        node:root,
        finded:false,
        found_node:btree
    }

    while(!root.over){
        output.node = root
        if(root.input >= sorted_items){
            output.found_node = root
            output.finded = 1
            root = btree_nodes[root.left]
        }else{
            root = btree_nodes[root.right]
            output.finded = 0
        }
    }
    return output
}

console.assert(binary_tree_search_element(0x1616161616161616n).found_node.input == 0x1616161616161616n)
//===== end BTree search


//========== test a combine ===========

function get_result(input_array){
    let sorted_items = bucket_sort_list_toint64(input_array)


    let search_result = binary_tree_search_element(sorted_items).found_node
    if(search_result.over || sorted_items < search_result.input){
        search_result = btree
    }
    if(search_result == btree || search_result.output == 0){
        //you can use the BSearch algorithm from game, or just scan recipes.xml 


        //总之就是没有查到固定组合
        //中间是一系列算法
        //GetBagOfCraftItemId L131
    }
    return Number(search_result.output)
}

let input_array = [0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n,0x16n]
console.log(get_result(input_array))


