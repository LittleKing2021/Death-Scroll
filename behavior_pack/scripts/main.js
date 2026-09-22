import { world, system, ItemStack } from "@minecraft/server"

function particle(player){

}

world.afterEvents.itemStartUse.subscribe(({ itemStack: item, source: player }) => {
    if(item.typeId != "new:grave_scroll" ) return;

    if (!player.getDynamicProperty("LastDeath")){
        player.runCommand(`title @s actionbar Go Die First`)
    }else{
        player.runCommand(`playsound "portal.trigger" @s`)
        player.runCommand(`particle minecraft:basic_portal_particle ~ ~2 ~`)
        player.runCommand(`particle minecraft:mob_portal ~ ~2 ~`)
        player.runCommand(`particle minecraft:portal_directional ~ ~2 ~`)
    }
})
world.afterEvents.itemStopUse.subscribe(({ itemStack: item, source: player })=>{
    if (item.typeId == "new:grave_scroll"){
        player.runCommand(`stopsound @s "portal.trigger"`)
    }
})
world.afterEvents.itemCompleteUse.subscribe(({itemStack:item,source:player})=>{
    if (item.typeId == "new:grave_scroll" && player.getDynamicProperty("LastDeath")){
        let deathData = JSON.parse(player.getDynamicProperty("LastDeath"))
        if(deathData.dimension.id != player.dimension.id){
            player.runCommand(`title @s actionbar Must be in the same dimension`)
            return
        }
        player.runCommand(`stopsound @s "portal.trigger"`)
        player.teleport(deathData.location)
        player.setDynamicProperty("LastDeath",undefined)
        system.runTimeout(()=>{
            player.runCommand(`playsound "mob.endermen.portal" @s`)
        },2)
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