GameMode_Normal = 0
GameMode_Hard = 1
GameMode_Greedy = 2
GameMode_Greedier = 3

ROOMTYPE_OTHER = 0
ROOMTYPE_SUPERSECRET = 8

HeartNames = {
    "5.10.1":"红心",
    "5.10.2":"半红心",
    "5.10.3":"魂心",
    "5.10.4":"永恒之心",
    "5.10.5":"双红心",
    "5.10.6":"黑心",
    "5.10.7":"金心",
    "5.10.8":"半魂心",
    "5.10.9":"害怕的心",
    "5.10.10":"混合心",
    "5.10.11":"骨心",
    "5.10.12":"腐心",
}

class Rate{
    constructor(a,b,expr){
        //a是分子，b是分母
        this.a = a
        this.b = b
        this.number = Number(a)/Number(b)
        if(expr == undefined)
            this.expr = a + "/" + b
        else
            this.expr = expr
    }
    simple(){

        let gcd = function(a, b) {
            if (b == 0n) {
                return a;
            }
            
            return gcd(b, a % b);
        }
          
        while(true){
            let g = gcd(this.a,this.b)
            if(g == 1n || g == 0n){
                break
            }
            this.a /= g
            this.b /= g
        }
        return this
    }
    add(other){
        let expr
        if(this.a == 0){
            expr = other.expr
        }else if(other.a == 0){
            expr = this.expr
        }else{
            expr = `(${this.expr})+(${other.expr})`
        }
        return new Rate(this.a * other.b + this.b * other.a, this.b * other.b, expr).simple()
    }
    mul(other){
        let expr
        if(this.a == this.b){
            expr = other.expr
        }else if(other.a == other.b){
            expr = this.expr
        }else{
            expr = `(${this.expr})+(${other.expr})`
        }
        return new Rate(this.a*other.a, this.b*other.b, expr).simple()
    }
    sub(other){
        let expr
        if(other.a == 0){
            expr = this.expr
        }else{
            expr = `(${this.expr})-(${other.expr})`
        }
        return new Rate(this.a * other.b - this.b * other.a, this.b * other.b, expr).simple()
    }

    not(){
        let expr
        if(this.a == 0){
            expr = "1"
        }else{
            expr = `1-(${this.expr})`
        }
        return new Rate(this.b - this.a, this.b,expr)
    }
    and(other){
        return this.mul(other)
    }
    or(other){
        return this.add(this.not().and(other))
    }
}

function RndRate(x){
    /* RandInt(x) == 0 */
    return new Rate(1n,BigInt(x))
}
function BoolRate(bool){
    if(bool)
        return new Rate(1n,1n)
    else
        return new Rate(0n,1n)
}

class ProgramContext{
    constructor(other){
        if(other){
            this.SubType = other.SubType
            this.Variant = other.Variant
        }else{
            this.SubType = 1
            this.Variant = 10
        }
    }

    hash(){
        return "5." + this.Variant + "." + this.SubType
    }
}

class ProgramStatus{
    constructor(rate, cloned_status){
        if(cloned_status){
            this.context = new ProgramContext(cloned_status.context)
        }else{
            this.context = new ProgramContext()
        }
        this.rate = rate
    }

    do_if(then_rate, then_function, else_function){
        let then_status = new ProgramStatus(this.rate.and(then_rate), this)
        let else_status = new ProgramStatus(this.rate.and(then_rate.not()), this)
        if(then_function){
            then_function(then_status.context)
        }
        if(else_function){
            else_function(else_status.context)
        }

        return [then_status,else_status]
    }

    add_rate(rate){
        return new ProgramStatus(this.rate.add(rate), this)
    }
}

class ProgramStatusCollection{
    constructor(){
        /* status_diction存储当前各个程序可能的上下文状态及其概率，Key-Value形式存储，Key是ProgramContext的hash，Value是ProgramStatus */
        this.status_diction = {}
    }

    add_status(status){
        if(this.status_diction[status.context.hash()]){
            this.status_diction[status.context.hash()] = this.status_diction[status.context.hash()].add_rate(status.rate)
        }else{
            this.status_diction[status.context.hash()] = status
        }
    }

    do_if(then_rate_for_program_context, then_function_for_program_context, else_function_for_program_context){
        let new_status_dict = []
        for(let hash in this.status_diction){
            let r = this.status_diction[hash].do_if(
                then_rate_for_program_context(this.status_diction[hash].context),
                then_function_for_program_context,
                else_function_for_program_context
            )
            //add r0 r1 to newList
            new_status_dict.push(r[0])
            new_status_dict.push(r[1])
        }
        this.status_diction = {}
        for(let status of new_status_dict)
            this.add_status(status)
        return this
    }

    get(rate_for_context){
        /* rate_for_context returns rate 0 ~ 1 */
        let ret = {}
        for(let hash in this.status_diction){
            let rate = rate_for_context(this.status_diction[hash])
            if(rate.a != 0n){
                if(rate.a == rate.b){
                    ret[hash] = this.status_diction[hash]
                    delete this.status_diction[hash]
                }else{
                    ret[hash] = new ProgramStatus(this.status_diction[hash].rate.and(rate),this.status_diction[hash])
                    this.status_diction[hash] = new ProgramStatus(this.status_diction[hash].rate.and(rate.not()),this.status_diction[hash])
                }
            }
        }

        let ret_collection = new ProgramStatusCollection()
        for(let hash in ret){
            ret_collection.add_status(ret[hash])
        }
        return ret_collection
    }

    apply(func_for_context){
        let new_dict = []
        for(let hash in this.status_diction){
            let new_status = new ProgramStatus(this.status_diction[hash].rate, this.status_diction[hash])
            func_for_context(new_status.context)
            new_dict.push(new_status)
        }
        this.status_diction = {}
        for(let status of new_dict){
            this.add_status(status)
        }
        return this
    }

    merge(status_collection){
        for(let hash in status_collection.status_diction){
            this.add_status(status_collection.status_diction[hash])
        }
    }


    check_sum(){
        let r = new Rate(0n,1n)
        for(let hash in this.status_diction){
            r = r.add(this.status_diction[hash].rate)
        }
        return r
    }
}
function GetRedHeartProb(
    GameMode                /* Number */,
    IsAchievementUnlocked   /* function(achievement_id) => bool */,
    HasCollectible          /* function(collectible_id) => bool */,
    HasTrinket              /* function(trinket_id)=>bool */,
    TrinketCountIsTwo               /* function(trinket_id)=>bool */, 
    PlayerIs                /* function(player_id) => bool */, 
    RoomType                /* integer */,
    RoomId /* integer, only used in SUPER_SEGRET_ROOM */)
    {
    IsHard = GameMode_Hard == GameMode || GameMode_Greedier == GameMode
    IsGreddyOrGredier = GameMode == GameMode_Greedy || GameMode == GameMode_Greedier
    let psc = new ProgramStatusCollection()
    psc.add_status(new ProgramStatus(BoolRate(true)))
    psc
    .do_if(
        (c)=>RndRate(2),
        (c)=>{c.SubType = 2}
    )
    .do_if(
        (c)=>RndRate(IsHard ? 50 : 20),
        (c)=>c.SubType = 5
    )
    .do_if(
        ()=>RndRate(50),
        (c)=>c.SubType = 12
    )
    .do_if(
        ()=>RndRate(100),
        (c)=>c.SubType=9
    )
    .do_if(
        ()=>RndRate(100),
        (c)=>c.SubType=10
    )
    .do_if(
        ()=>RndRate(50).or(
            BoolRate(HasTrinket(18)).and(RndRate(30/(TrinketCountIsTwo(18) ? 2 : 1)))
            ).or(
                BoolRate(HasCollectible(238)).and(RndRate(40))
            ).or(
                BoolRate(HasCollectible(239)).and(RndRate(40))
            )
            ,
        (c)=>c.SubType=4
    )
    
    let temp_if = psc.get(
        ()=>RndRate(10).or(
            BoolRate(HasCollectible(173)).and(RndRate(3))
        ).or(
            BoolRate(HasTrinket(38)).and(RndRate(30/(TrinketCountIsTwo(38) ? 2 : 1)))
        ).or(
            BoolRate(PlayerIs(5)).and(RndRate(16))
        )).apply((c)=>c.SubType = 3)

    temp_if.do_if(
        (c)=>RndRate(4).and(BoolRate(IsAchievementUnlocked(33))),
        c=>c.SubType = 8
    ).do_if(
        c=>RndRate(20).and(BoolRate(IsAchievementUnlocked(391))),
        c=>c.SubType = 11
    ).do_if(
        c=>RndRate(20).or(
            BoolRate(HasTrinket(17)).and(RndRate(10/(TrinketCountIsTwo(17) ? 2 : 1)))
        ),
        c=>c.SubType = 6
    ).do_if(
        c=>RndRate(5).and(BoolRate(PlayerIs(16) || PlayerIs(17))),
        c=>c.SubType = 11
    )

    psc.merge(temp_if)
    psc.do_if(
        c=>RndRate(160).and(BoolRate(IsAchievementUnlocked(224))),
        c=>c.SubType = 7
    )
    psc.do_if(
        c=>BoolRate(HasTrinket(22) && RoomType != ROOMTYPE_SUPERSECRET),
        c=>c.SubType = 6
    )

    //此后处理Variant不为0的情况

    if(RoomType == 8)
    {
        if(RoomId == 0){
            psc.apply(c=>c.SubType = 1)
        }else{
            if(IsGreddyOrGredier){
                if(RoomId == 4){
                    psc.apply(c=>c.SubType = 3)
                }else if(RoomId == 24){
                    psc.apply(c=>c.SubType=4)
                }else if(RoomId == 25){
                    psc.apply(c=>c.SubType = 2)
                    if(HasTrinket(87)){
                        psc.apply(c=>c.SubType = 1)
                    }
                }else if(RoomId == 5){
                    psc.apply(c=>c.SubType=6)
                }else{
                    psc.do_if(
                        c=>BoolRate(c.SubType == 2 && HasTrinket(87)),
                        c=>c.SubType = 1
                    )    
                }
            }else{
                if(RoomId == 1)
                    psc.apply(c=>c.SubType=4)
                else if(RoomId == 6)
                    psc.apply(c=>c.SubType = 6)
                else{
                    psc.do_if(
                        c=>BoolRate(c.SubType == 2 && HasTrinket(87)),
                        c=>c.SubType = 1
                    )    
                }
            }
        }
    }else{
        psc.do_if(
            c=>BoolRate(c.SubType == 2 && HasTrinket(87)),
            c=>c.SubType = 1
        )    
    }


    //处理其它分支

    //LABEL 373

    psc.do_if(
        c=> 
            BoolRate(HasCollectible(203)).and(RndRate(2))
            .or(BoolRate(c.Variant == 40 && HasCollectible(250)))
            //.and(!BoolRate(IsLoadingRoom))
        ,
        c=>{
            if(c.Variant == 10 && (c.SubType == 1 || c.SubType == 9)){
                c.SubType = 5
            }
            /* I dont care others */
        }
    )


    return psc.status_diction

    // let text = ""
    // for(let i=1;i<=12;i++){
    //     let item = "H" + i
    //     text += (psc.status_diction[item].context.SubType + ":" + psc.status_diction[item].rate.a + "/" + psc.status_diction[item].rate.b)
    //     text += "\n"
    // }
    // document.getElementById('output').value = text
}



function PrintResult(){
    result = GetRedHeartProb(
        +document.getElementById('GameMode').value,
        (aid)=>{
            //成就
            item = document.getElementById('achieve_'+aid)
            if(item){
                return item.checked
            }
            return false
        }, (cid)=>{
            item = document.getElementById('collect_'+cid)
            if(item){
                return item.checked
            }
            return false

        }, (tid)=>{
            item = document.getElementById('trinket_'+tid)
            if(item){
                return item.checked
            }
            return false
        },
        (tid)=>{
            if(document.getElementById('mombox').checked)
                return true
            
            item = document.getElementById('trinket_double_'+tid)
            if(item){
                return 2==+item.value
            }
            return false
    
        },
        (pid)=>{
            item = document.getElementById('player_'+pid)
            if(item){
                return item.checked
            }
            return false

            //return pid == +document.getElementById('PlayerID').value
        },
        +document.getElementById('GameRoom').value,
        +document.getElementById('SuperSecretRoomId').value
        )

    let txt = ''
    for(let i=1;i<=12;i++){
        let k = '5.10.'+i
        txt += k + "\t" + HeartNames[k] + "\t"
        let result_rate = BoolRate(false)
        if(result[k]){
            result_rate = result[k].rate
        }
        if(document.getElementById('output_div').checked){
            txt += result_rate.a + "/" + result_rate.b
        }else{
            txt += result_rate.number
        }
        if(document.getElementById('output_expr').checked)
            txt += "=" + result_rate.expr
        txt += '\n'
    }
    document.getElementById('output').value = txt
}
