import { world, system, ItemStack } from "@minecraft/server"

var particle = {}
var itemUse = {}
function Particle(player,type = "use"){
    if(type == "use"){
        run(player,[
            `particle minecraft:mob_portal ^^2.6^`,
            `particle minecraft:mob_portal ^^2.6^`,
            `particle minecraft:mob_portal ^^2.6^`,
            `particle minecraft:mob_portal ^^2.6^`,
            `particle minecraft:mob_portal ^^2.6^`,
            
        ],40)
        run(player,[
            `particle minecraft:mob_portal ~0.1 ~1 ~2`,
            `particle minecraft:mob_portal ~0.2 ~2 ~1.8`,
            `particle minecraft:mob_portal ~0.3 ~3 ~1.5`,
            `particle minecraft:mob_portal ~0.4 ~4 ~1`,
        ],1)
        run(player,[
            `particle minecraft:portal_directional ~1.3 ~2 ~0.5`,
            `particle minecraft:portal_directional ~1.2 ~2.1 ~0.8`,
            `particle minecraft:portal_directional ~1.1 ~2.8 ~0.8`,
            `particle minecraft:portal_directional ~1.3 ~2 ~0.8`,
            `particle minecraft:portal_directional ~0.3 ~1.4 ~0.1`,
            `particle minecraft:portal_directional ~0.3 ~1 ~0.1`,
            `particle minecraft:portal_directional ~0.3 ~1 ~0.1`,
            `particle minecraft:portal_directional ~0.3 ~1.4 ~0.1`,
            `particle minecraft:portal_directional ~-0.1 ~1.1 ~-2.3`,
            `particle minecraft:portal_directional ~-0.1 ~1.2 ~-2.3`,
            `particle minecraft:portal_directional ~-0.1 ~1.3 ~-2.3`,
            `particle minecraft:portal_directional ~-0.1 ~1.4 ~-2.3`,
            `particle minecraft:portal_directional ~-0.1 ~2.5 ~-0.3`,
            `particle minecraft:portal_directional ~-0.1 ~2.6 ~-0.3`,
            `particle minecraft:portal_directional ~-0.1 ~2.7 ~-0.3`,
            `particle minecraft:portal_directional ~-0.1 ~2.8 ~-0.3`,
        ],10)
        run(player,[
            `particle minecraft:mob_portal ~0.1 ~1 ~`,
            `particle minecraft:mob_portal ~0.1 ~1.1 ~0.1`,
            `particle minecraft:mob_portal ~0.1 ~1.2 ~0.2`,
            `particle minecraft:mob_portal ~0.1 ~1.3 ~0.3`,
            `particle minecraft:mob_portal ~0.1 ~1.4 ~0.4`,
            `particle minecraft:mob_portal ~0.1 ~1.5 ~0.5`,
            `particle minecraft:mob_portal ~0.1 ~1.6 ~0.6`,
            `particle minecraft:mob_portal ~0.1 ~1.7 ~0.7`,
            `particle minecraft:mob_portal ~0.1 ~1.8 ~0.8`,
            `particle minecraft:mob_portal ~0.1 ~1.9 ~0.9`,
            `particle minecraft:mob_portal ~0.1 ~2 ~1`,
            `particle minecraft:mob_portal ~0.1 ~2.1 ~1.1`,
        ],7)
        run(player,[
            `particle minecraft:basic_portal_particle ~ ~3 ~`,
            `particle minecraft:basic_portal_particle ~ ~4 ~`,
            `particle minecraft:basic_portal_particle ~ ~5 ~`,
            `particle minecraft:basic_portal_particle ~1 ~3 ~`,
            `particle minecraft:basic_portal_particle ~2 ~3 ~`,
            `particle minecraft:basic_portal_particle ~3 ~3 ~`,
            `particle minecraft:basic_portal_particle ~ ~3 ~0.1`,
            `particle minecraft:basic_portal_particle ~ ~2 ~0.3`,
        ],3)
    }
    if(type == "done"){
        run(player,[
            `particle minecraft:mob_portal ^0.3^2.6^0.2`,
            `particle minecraft:mob_portal ^0.3^2.4^0.2`,
            `particle minecraft:mob_portal ^^2.6^`,
            `particle minecraft:mob_portal ^^2.5^`,
            `particle minecraft:mob_portal ^0.1^2.6^0.1`,
        ],20)
        run(player,[
            `particle minecraft:basic_portal_particle ~ ~3 ~`,
            `particle minecraft:mob_portal ~ ~2 ~`,
            `particle minecraft:portal_directional ~ ~2 ~`,
            `particle minecraft:basic_portal_particle ~ ~2 ~1`,
            `particle minecraft:mob_portal ~ ~1.6 ~1`,
            `particle minecraft:mob_portal ~ ~2.5 ~`,
            `particle minecraft:basic_portal_particle ~0.3 ~1 ~`,
            `particle minecraft:basic_portal_particle ~0.5 ~2 ~`,
        ])
        run(player,[
            `particle minecraft:basic_portal_particle ~1 ~1.5 ~`,
            `particle minecraft:basic_portal_particle ~1.3 ~1.5 ~`,
            `particle minecraft:basic_portal_particle ~1.6 ~1.5 ~`,
            `particle minecraft:portal_directional ~ ~2 ~`,
            `particle minecraft:basic_portal_particle ~1 ~1.5 ~1`,
            `particle minecraft:portal_directional ~1 ~0.5 ~`,
            `particle minecraft:basic_portal_particle ~ ~1 ~1`,
            `particle minecraft:basic_portal_particle ~ ~0.7 ~1`,
            `particle minecraft:portal_directional ~ ~1 ~1`,
            `particle minecraft:basic_portal_particle ~ ~1 ~1`,
            `particle minecraft:basic_portal_particle ~ ~2 ~1`,
            `particle minecraft:portal_directional ~ ~2 ~`,
            `particle minecraft:basic_portal_particle ~ ~0.2 ~1.1`,
            `particle minecraft:basic_portal_particle ~ ~0.5 ~1.2`,
            `particle minecraft:portal_directional ~1 ~2 ~1`,
            `particle minecraft:basic_portal_particle ~ ~0.7 ~1.4`,
        ],8)
    }
}
function run (player,info = [],time = 0){
    info.forEach(command => {
        system.runTimeout(()=>{
            itemUse[player.id] == undefined || itemUse[player.id] == false ?
            null : player.runCommand(command)
        },time)
    })
}

world.afterEvents.itemUse.subscribe(({itemStack:item,source:player})=>{
    if(item.typeId != "minecraft:stick") return
    Particle(player,"use")
})
world.afterEvents.itemStartUse.subscribe(({ itemStack: item, source: player }) => {
    if(item.typeId != "new:grave_scroll" ) return
    let deathData = JSON.parse(player.getDynamicProperty("LastDeath"))
    
    if (!player.getDynamicProperty("LastDeath")){
        player.runCommand(`title @s actionbar Go Die First`)
    }else if(deathData.dimension.id != player.dimension.id){
        player.runCommand(`title @s actionbar Must be in the same dimension`)
    }else{
        player.runCommand(`playsound "portal.trigger" @s`)
        itemUse[player.id] = true
        Particle(player)
    }
})
world.afterEvents.itemStopUse.subscribe(({ itemStack: item, source: player })=>{
    if (item.typeId == "new:grave_scroll"){
        player.runCommand(`stopsound @s "portal.trigger"`)
        itemUse[player.id] = false
    }
})
world.afterEvents.itemCompleteUse.subscribe(({itemStack:item,source:player})=>{
    if (item.typeId == "new:grave_scroll" && player.getDynamicProperty("LastDeath")){
        player.runCommand(`stopsound @s "portal.trigger"`)
        itemUse[player.id] = false
        Particle(player,"done")
        player.teleport(deathData.location)
        player.setDynamicProperty("LastDeath",undefined)
        system.runTimeout(()=>{
            player.runCommand(`playsound "mob.endermen.portal" @s`)
        },2)
        player.startItemCooldown("grave_scroll",20)
        if(player.getGameMode() == 'Creative') return
        if(item.amount > 1){
            let item2 = new ItemStack(item.typeId,item.amount-1)
            player.getComponent("inventory").container.setItem(player.selectedSlotIndex,item2)
        }else{
            player.getComponent("inventory").container.setItem(player.selectedSlotIndex,undefined)
        }
    }
})
world.afterEvents.entityDie.subscribe(({damageSource:Dp,deadEntity:dead})=>{
    if(dead.typeId == "minecraft:player"){
        let death = { location:dead.location, dimension:dead.dimension }
        dead.setDynamicProperty("LastDeath",JSON.stringify(death))
    }
})


system.runInterval(()=>{
    for(const player of world.getAllPlayers()){
        const container = player.getComponent("inventory").container
        const item = container.getItem(player.selectedSlotIndex)
        if(!player.getDynamicProperty("LastDeath") && item?.typeId == "new:grave_scroll"){
           //container.setItem(player.selectedSlotIndex,new ItemStack("new:grave_scroll2",item.amount))
        }
        if(player.getDynamicProperty("LastDeath") && item?.typeId == "new:grave_scroll2"){
           //container.setItem(player.selectedSlotIndex,new ItemStack("new:grave_scroll",item.amount))
        }
    }
}, 15)