//@ts-check

import { BlockComponentTypes, system, world } from "@minecraft/server";

system.runInterval(()=>{
    const objectives = world.scoreboard.getObjectives();

    for(const objective of objectives){
        if(objective.id.startsWith("containerItemCount:")){
            //スコアをリセット
            for(const participant of objective.getParticipants()){
                world.scoreboard.getObjective(objective.id)?.removeParticipant(participant);
            }

            //取得するコンテナの座標
            const split = objective.id.split(":");
            const dimension = split[1];

            if(dimension !== "overworld" && dimension !== "nether" && dimension !== "the_end") continue;
            const location = {
                x: parseInt(split[2]),
                y: parseInt(split[3]),
                z: parseInt(split[4])
            };

            const container = world.getDimension(dimension).getBlock(location)?.getComponent(BlockComponentTypes.Inventory)?.container;
            if(!container) continue;
            
            for(let i = 0; i < container?.size; i++){
                const item = container.getItem(i);
                if(!item) continue;

                world.scoreboard.getObjective(objective.id)?.addScore(item.typeId, item.amount);
            }
        }
    }
});