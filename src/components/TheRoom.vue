<template>
  <div class="room" ref="room">
    <div class="wall">
      <div class="brick"></div>
      <div class="shadow"></div>
      <div class="doorway">
        <div class="door" ref="door1" id="door1">
          <div class="after"></div>
          <img src="../assets/drugStore.png" v-if="doors[`door1`]==`DrugStore`" class="image" >
          <img src="../assets/shop.png" v-if="doors[`door1`]==`Shop`" class="image" >
        </div>
      </div> 
    </div>
    <div class="wall">
      <div class="brick"></div>
      <div class="shadow"></div>
      <div class="doorway"></div> 
    </div>
    <div class="wall">
      <div class="brick"></div>
      <div class="shadow"></div>
      <div class="doorway">
        <div class="door" ref="door2" id="door2">
          <div class="after"></div>
          <img src="../assets/drugStore.png" v-if="doors[`door2`]==`DrugStore`" class="image" >
          <img src="../assets/shop.png" v-if="doors[`door2`]==`Shop`" class="image" >
        </div>
      </div> 
    </div>
    <div class="wall">
      <div class="brick"></div>
      <div class="shadow"></div>
      <div class="doorway">
        <div class="door" ref="door3" id="door3">
          <div class="after"></div>
          <img src="../assets/drugStore.png" v-if="doors[`door3`]==`DrugStore`" class="image" >
          <img src="../assets/shop.png" v-if="doors[`door3`]==`Shop`" class="image" >
        </div>
      </div> 
    </div>
    <div class="wall">
      <div class="shadow"></div>
    </div>
    <div class="wall">
      <div class="tiles">
        <div class="shadow"></div>
        <div class="doorFlat" ref="doorFlat"></div>
      </div>
      <div class="enemyZone" ref="enemyZone">
        <div class="enemy" v-for="enemy in enemies">
          <div class="mask" v-if="currentScreen===`Battle`"></div>
          <div class="place">
            <Transition name="enemy">
              <div class="stats" v-if="enemy.health>0">
                <div class="firstRow row">
                  <TransitionGroup name="effects">
                    <div class="effect" v-for="effect in enemy.effects" :key="effect.type">
                      <div class="image" :style="{backgroundImage:`url(${getImage(effect.type)})`}"></div>
                      <div class="statBlock">
                        <div class="stat">{{effect.duration}}</div>
                        <div class="stat">{{emit(effect)||`0`}}</div>
                      </div>
                    </div>
                  </TransitionGroup >
                </div>
                <div class="secondRow row">
                  <div class="health stat">
                    <img class="img" src="../assets/heart.png" alt="">
                    {{enemy.health}}
                  </div>
                  <div class="damage stat">
                    <img class="img" src="../assets/sword.png" alt="">
                    {{enemy.damage}}
                  </div>
                </div>
              </div>
            </Transition>
            <Transition name="enemy">  
              <img v-if="enemy.health>0" class="image" src="../assets/enemy.png" >
            </Transition>
          </div>
          <Transition name="enemy">  
            <div class="blood" v-if="!(enemy.health>0)">
              <img class="image" src="../assets/blood.png" >
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <div class="bulb" ref="bulb"></div>
    <div class="content">
      <img src="../assets/chestClosed.png" v-if="currentRoom===`Battle`"  class="image first">
      <img src="../assets/chestOpen.png" v-if="currentRoom===`FreeRoom`"  class="image first">
      <img src="../assets/pedestal.png" v-if="currentRoom===`Battle`||currentRoom===`FreeRoom`"  class="image second">
      <img src="../assets/market.png" v-if="currentRoom===`Shop`||currentRoom===`DrugStore`"  class="image third">
      <img src="../assets/shop.png" v-if="currentRoom===`Shop`" class="image fourth">
      <img src="../assets/drugstore.png" v-if="currentRoom===`DrugStore`"  class="image fourth">
    </div>
  </div>
  <transition>
    <div class="darkened" v-if="fadeVisibility"></div>
  </transition>
</template>

<script setup lang="ts">
import {ref,onMounted,inject,watch,reactive,nextTick} from "vue"
const store:any=inject(`store`)
const display:any=inject(`display`)
const images:any=inject(`images`)
const room=ref()
const bulb=ref()
const door2=ref()
const door1=ref()
const door3=ref()
const doorFlat=ref()
const fadeVisibility=ref(true)
const currentWord=store.returnCurrentWord()
const currentScreen=store.returnCurrenScreen()
const doors=store.returnDoors()
const currentRoom=store.returnCurrentRoom()
const isAlive=store.returnIsAlive()
const enemies=store.returnEnemies()
const stats=store.returnStats()
const select=store.returnSelect()
const enemyZone=ref()
const difficulty=store.returnDifficulty()
const yourTurn=store.returnYourTurn()
const list:any=store.returnList()
const slots=store.returnSlots()
const cards=store.returnInventory().cards
let nearDoor:any=false
let prevSelect=0
let adjastiveRoomStyle=``
const baseRoomStyle=`
  translate(-50%, -50%)
  translateZ(150px)
  scale(${display.width.value/400})
`
const startRoomStype=` 
  translate(-50%, -50%)
  translateZ(-100px)
  scale(${display.width.value/400})
`
const baseBulbStyle=`
  translateX(-50%) 
  rotateX(180deg)
`

onMounted(()=>nextTick(toNull))
  
watch(currentWord,()=>{
  if(currentScreen.value===`FreeRoom`){
    switch (currentWord.value){
      case `left` : 
        rotateToDoor(door2.value,`rotateY(-90deg)`)
        break
      case `right` : 
        rotateToDoor(door3.value,`rotateY(90deg)`)
        break
      case `forward` : 
        rotateToDoor(door1.value,` `)
        break 
      case `go inside` :
        doorAction(nearDoor)
        break 
      case `corner`:
        rotateToDoor(false,`rotateY(-45deg)`)
        if(currentRoom.value===`DrugStore`){
          currentScreen.value=`DrugStore`
        }else if(currentRoom.value===`Shop`){
          currentScreen.value=`Shop`
        }else{
          currentScreen.value=`Chest`
        }
        break  
    }
  }
  if(currentScreen.value===`Menu`){
    if(currentWord.value===`restart`){
      room.value.style.transform=startRoomStype
      bulb.value.style.transform=baseBulbStyle
      currentScreen.value=`FreeRoom`
    }
  }
  if(currentScreen.value===`Battle`&&yourTurn.value&&currentWord.value===list[0]&&stats.energy.value>0&&enemies[select.value-1].health>0){
    list.shift()
    stats.energy.value--
    let calculatedAttack=calcAttack(currentWord.value).effect
    const miss:any=calculatedAttack.find((item:any)=>item.type==="-miss")
    const splash:any=calculatedAttack.find((item:any)=>item.type==="splash")
    let damage=stats.damage.value
    calculatedAttack.forEach((effect:any)=>{
      switch (effect.type){
        case `crit`:
          damage+=Math.floor(stats.damage.value/100*effect[`amplification`])
          delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
          break
        case `-weakness`:
          damage+=Math.ceil(stats.damage.value/100*effect[`damage`])
          delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
          break
        case `heal`:
          if(stats.health.value+effect[`heal`]>stats.healthMax.value){
            stats.health.value=stats.healthMax.value
          }else{
            stats.health.value+=effect[`heal`]
          }
          delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
          break
        case `energy`:
          stats.energy.value++
          if(stats.energy.value+effect[`energy`]>stats.energyMax.value){
            stats.energy.value=stats.energyMax.value
          }else{
            stats.energy.value+=effect[`energy`]
          }
          delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
          break
        case `-energy`:
          if(+stats.energy.value+effect[`energy`]<0){
            stats.energy.value=0
          }else{
            stats.energy.value+=effect[`energy`]
          }
          delete calculatedAttack[calculatedAttack.indexOf(effect as never)]
          break
      }
    })
    if(miss){
      if(miss.miss>Math.random()*100){return}
      delete calculatedAttack[calculatedAttack.indexOf(miss as never)]
    }
    enemies[select.value-1].health-=damage
    IAttackAnimation()
    setTimeout(enemyHitAnimation,100)
    if(splash){
      enemies.forEach((enemy:any,ind:any)=>{
        if(enemy===enemies[select.value-1]){return}
        setTimeout(()=>{
          enemyHitAnimation(ind+1)
          enemy.health-=Math.floor(damage/100*splash[`splash`])
        },200)
      })
      calculatedAttack.splice(calculatedAttack.indexOf(splash as never),1)
    }
    calculatedAttack=calculatedAttack.filter(() => true)
    calculatedAttack.forEach((effect:any)=>setEffect(effect))
  }
  const find:any=slots.find((item:any)=>item?.name===currentWord.value)
  if(yourTurn.value&&find){
    if(find.name===`grenade`&&stats.energy.value>0){
      stats.energy.value--
      find.amount--
      enemies.forEach((enemy:any,ind:any)=>{
        enemyHitAnimation(ind+1)
        enemy.health-=find.damage
      })
    }else if(find.name===`molotov`&&stats.energy.value>0){
      stats.energy.value--
      find.amount--
      setEffect(find.effect,true)
    }else if(find.name===`flash`&&stats.energy.value>0){
      stats.energy.value--
      find.amount--
      setEffect(find.effect,true)
    }else if(find.name===`smoke`&&stats.energy.value>0){
      stats.energy.value--
      find.amount--
      setEffect(find.effect,true)
    }else if(find.name===`gas`&&stats.energy.value>0){
      stats.energy.value--
      find.amount--
      setEffect(find.effect,true)
    }else if(find.name===`medkit`||find.name===`heal potion`){
      stats.health.value=stats.health.value+find.heal>stats.healthMax.value?stats.healthMax.value:stats.health.value+find.heal
      find.amount--
    }else if(find.name===`energy drink`||find.name===`energy potion`){
      stats.energy.value=stats.energy.value+find.heal>stats.energyMax.value?stats.energyMax.value:stats.energy.value+find.energy
      find.amount--
    }    
  }
})

watch(currentScreen,()=>{
  if(currentScreen.value===`StartMenu`){
    room.value.style.transform=startRoomStype
  }
})

watch(isAlive,()=>{
  if(isAlive.value===false){
    room.value.style.transform=`
      ${startRoomStype}
      translateX(90px)
      translateY(50px)
      rotateZ(90deg)
    `
  }else{
    room.value.style.transform=startRoomStype
  }
})

watch(yourTurn,()=>{
  if(yourTurn.value===false){
    let lenght=0
    function enemyTurn(){
      const enemy=enemies[lenght]
      lenght++
      if(!enemy){return}
      const stun=enemy.effects.find((effect:any)=>effect.type===`stun`)
      if(enemy.health>0){
        if(!stun){
          enemyAttackAnimation(enemyZone.value.children[lenght-1].children[1])
          let damage=enemy.damage
          const weakness=enemy.effects.find((effect:any)=>effect.type===`weakness`)
          const miss=enemy.effects.find((effect:any)=>effect.type===`miss`)
          if(weakness){
            damage=damage-(damage/100*weakness.weakness)
          }
          if(miss&&miss.miss>Math.random()*100){
            damage=0
          }
          setTimeout(()=>{
            stats.health.value-=Math.round(damage)
            IHitAnimation()
          },200)
        }
        enemy.effects.forEach((effect:any)=>{
          if(effect.damage){
            setTimeout(()=>{
              enemyHitAnimation(lenght)
              enemy.health-=effect.damage
            },400)
          }
          effect.duration--
          if(effect.duration===0){
            delete enemy.effects[enemy.effects.indexOf(effect)]
          }
        })
        enemy.effects=enemy.effects.filter(() => true)
        setTimeout(enemyTurn,600)
      }else{
        enemyTurn()
      }
    }
    enemyTurn()
    yourTurn.value=true
    stats.energy.value=stats.energyMax.value
    stats.health.value+=stats.healthRegen.value
    stats.health.value>stats.healthMax.value?stats.health.value=stats.healthMax.value:null
  }
})

watch(select,maskSelection)

function calcAttack(word:string){
  const exit={effect:[]}
  cards.forEach((card:any)=>{
    if(word.includes(card.letter)){
      card.effect.forEach((effect:any)=>{
        const find=exit.effect.find((item:any)=>{
          return item?.type===effect.type
        })
        if(find){
          Object.keys(find).forEach((item:any)=>{
            if(item===`type`)return
            if((find as any).type[0]===`-`){
              if(Math.abs(find[item])>Math.abs(effect[item])){
                (find as any)[item]=effect[item]
              }
            }else{
              if(Math.abs(find[item])<Math.abs(effect[item])){
                (find as any)[item]=effect[item]
              }
            }
          })
        }else{
          exit.effect.push(effect as never)
        }
      })
    }
  })
  return exit
}

function IHitAnimation(){
  room.value.style.transition=`0.05s `
  room.value.style.transform=`${startRoomStype} translateX(10px)`
  setTimeout(()=>{
    room.value.style.transition=`0.1s `
    room.value.style.transform=`${startRoomStype} translateX(-10px)`
  },50)
  setTimeout(()=>{
    room.value.style.transition=`0.05s `
    room.value.style.transform=startRoomStype
  },150)
  setTimeout(()=>room.value.style.transition=`1s`,300)
}

function IAttackAnimation(){
  room.value.style.transition=`0.2s`
  room.value.style.transform=`${startRoomStype} translateZ(10px)`
  setTimeout(()=>{
    room.value.style.transform=startRoomStype
  },200)
  setTimeout(()=>{
    room.value.style.transition=`1s`
  },400)
}

function enemyHitAnimation(ind?:any){
  let enemy
  if(ind){
    if(enemies[ind-1].health<=0){return}
    enemy=enemyZone.value.children[ind-1].children[1]
  }else{
    if(enemies[select.value-1].health<=0){return}
    enemy=enemyZone.value.children[select.value-1].children[1]
  }
  const base=`translate(0,-35%) rotateX(-90deg)`
  enemy.style.transition=`0.05s `
  enemy.style.transform=`${base} translateX(10px)`
    setTimeout(()=>{
      enemy.style.transition=`0.1s `
      enemy.style.transform=`${base} translateX(-10px)`
    },50)
    setTimeout(()=>{
      enemy.style.transition=`0.05s `
      enemy.style.transform=base
    },150)
}

function enemyAttackAnimation(enemy:any){
  const base=`translate(0,-35%) rotateX(-90deg)`
  enemy.style.transition=`0.2s`
  enemy.style.transform=`${base} translateZ(20px)`
  setTimeout(()=>{
    enemy.style.transform=base
  },200)
}

function setEffect(effect:any,global?:boolean){
  function setInner(enemy:any){
    const find=enemy.effects.find((enemyEffect:any)=>enemyEffect.type===effect.type)
    if(find){
      Object.keys(find).forEach((item:any)=>{
        if(item===`type`)return
        if(Math.abs(find[item])<Math.abs(effect[item])){
          (find as any)[item]=effect[item]
        }
      })
    }else{
      enemy.effects.push(Object.assign({},effect))
    }
  }
  if(global){
    enemies.forEach((argument:any)=>{setInner(argument)})
  }else{
    setInner(enemies[select.value-1])
  }
}

function emit(effect:any){
  const duplicat=Object.assign({},effect)
  delete duplicat.type
  delete duplicat.duration
  return Object.values(duplicat)[0]
}

function getImage(name:string){
  if(typeof name !==`string`)return
  const fullName=name.split(``).filter((i)=>i!==` `&&i!==`%`&&i!==`-`).join(``)
  return images[`/src/assets/icons/${fullName}.png`].default
}

function maskSelection(){
  if(select.value===666||currentScreen.value!==`Battle`){return}
  const children=[...enemyZone.value.children][select.value-1]
  if(children){
    [...enemyZone.value.children].forEach((i)=>i.children[0].classList.add(`maskFade`))
    children.children[0].classList.remove(`maskFade`)
    prevSelect=select.value
  }else{
    select.value=prevSelect
  }
  
}

function toNull(){
  maskSelection()
  toggleTransition(`off`)
  store.jerkingSelect(1)
  room.value.style.transform=startRoomStype

  bulb.value.style.transform=baseBulbStyle

  door1.value.style.transform=``
  door1.value.children[0].style.opacity=`0`

  door2.value.style.transform=``
  door2.value.children[0].style.opacity=`0`

  door3.value.style.transform=``
  door3.value.children[0].style.opacity=`0`

  setTimeout(()=>{
    toggleTransition(`on`)
  },10)
  fadeVisibility.value=false
  doorFlat.value.style.transform=`
  translate(-${50+Math.round(Math.random()*20)-10}%,${50+Math.round(Math.random()*20)-10}%)
  rotateZ(${Math.round(Math.random()*40)-20}deg)
  `
}

function toggleTransition(mode:string){
  const doorTransition=mode===`on`?`0.3s`:`0s`
  const roomTransition=mode===`on`?`1s`:`0s`
  if(door1.value){
    door1.value.style.transitionDuration=doorTransition
    door1.value.children[0].style.transitionDuration=doorTransition
  }
  if(door2.value){
    door2.value.style.transitionDuration=doorTransition
    door2.value.children[0].style.transitionDuration=doorTransition
  }
  if(door3.value){
    door3.value.style.transitionDuration=doorTransition
    door3.value.children[0].style.transitionDuration=doorTransition
  }
  bulb.value.style.transition=roomTransition
  room.value.style.transition=roomTransition
}

function rotateToDoor(door:any, style:string){
  nearDoor=door
  adjastiveRoomStyle=style
  room.value.style.transform=` ${baseRoomStyle} ${adjastiveRoomStyle} `
  bulb.value.style.transform=` ${baseBulbStyle} ${adjastiveRoomStyle} `
}

function doorAction(door:any){
  if(nearDoor){
    door.style.transform=`
      translateZ(-${10+Math.round(Math.random()*20)}px)
      rotateX(90deg)
      rotateZ(${Math.round(Math.random()*20)-10}deg)
    `
    door.children[0].style.opacity=`1`
    const timeBeforeEnter=400
    setTimeout(()=>{
      fadeVisibility.value=true
      room.value.style.transform=`
        translate(-50%, -50%)
        translateZ(400px)
        scale(${display.width.value/400})
        ${adjastiveRoomStyle}
      `
    },timeBeforeEnter)

    setTimeout(()=>{
      toNull()
      currentRoom.value=doors[door.id]
      if(currentRoom.value===`DrugStore`){
        store.fullfillDrugStoreGoods()
      }else if(currentRoom.value===`Shop`){
        store.fullfillShopGoods()
      }else if(currentRoom.value===`Battle`){
        currentScreen.value=currentRoom.value
        enemies.length=0
        let random=Math.ceil(Math.random()*difficulty.value)
        while(random>0){
          random--
          enemies.push({
            health:ref((difficulty.value*6)+Math.ceil(Math.random()*(difficulty.value*6))),
            damage:ref(Math.round(difficulty.value/2)+Math.ceil(Math.random()*Math.round(difficulty.value/2))),
            effects:reactive([])
          })
        }
        store.fullfillChest()
      }
      doors.door2=`Battle`
      doors.door1=`Battle`
      doors.door3=`Battle`
      const randomNumber=Math.ceil(Math.random()*5)
      if(randomNumber===1&&currentRoom.value!==`DrugStore`){
        doors[`door`+Math.ceil(Math.random()*3)]=`DrugStore`
      }else if(randomNumber===2&&currentRoom.value!==`Shop`){
        doors[`door`+Math.ceil(Math.random()*3)]=`Shop`
      }else{
        difficulty.value++
        if(difficulty.value>8){
          difficulty.value=8
        }
      }
    },700+timeBeforeEnter)
  }
}

</script>

<style scoped lang="scss">
*{
  transform-style: preserve-3d;
}
.room{
  position: relative;
  top: 50%;
  left: 50%;
  transition: 1s;
  width:600px;
  height:200px;
  .wall{
    position: absolute;
    height: 100%;
    width:100%;
    filter: brightness(0.6) blur(0.7px);
    background-size: 35%;
    .enemyZone{
      width: 30%;
      position: absolute;
      top: 30%;
      left: 50%;
      transform: translate(-50%, 0%);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      .enemy{
        width: 25%;
        position: relative;   
        perspective: 10000px;
        aspect-ratio: 465/556;
        .mask{
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-width: 10px;
          border-image: url(../assets/borderGreen.svg) 35;
          border-style: solid;
          transition: 0.2s;
        }
        .maskFade{
          border-width: 0px;
          opacity: 0;
        }
        .place{
          aspect-ratio: 465/556;
          transform: translate(0,-35%) rotateX(-90deg);
          transform-origin: bottom;
          position: relative;
          display: flex;
          justify-content: center;
          .image{
            display: block;
            width: 100%;
            margin: 0 auto;
          }
          .stats{
            position: absolute;
            top: 0;
            transform: translate(0, -100%);
            display: flex;
            flex-direction: column;
            .row{
              display: flex;
              justify-content: center;
            }
            .firstRow{
              margin-bottom: 3px;
              flex-wrap: wrap;
              .effect{
                height: 30px;
                display: flex;
                position: relative;
                transition: 0.2s;
                .image{
                  height: 100%;
                  aspect-ratio: 1/1;
                  background-repeat: no-repeat;
                  background-size: auto 90%;
                  background-position: 50% 50%;
                  filter: grayscale(0.4);
                }
                .statBlock{
                  height: 100%;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-evenly;
                  position: absolute;
                  right: 0;
                  .stat{
                    font-size: 10px;
                    line-height: normal;
                    color: rgb(0, 198, 17);
                    text-align: right;
                  }
                }
              }
            }
            .secondRow{
              color: rgb(168, 166, 133);
              height: 20px;
              gap: 3px;
              .stat{
                display: flex;
                font-size: 11px;
                line-height: normal;
                align-items: center;
                transition: 0.5s;
              }
              img{
                display: inline-block;
                height: 20px;
                filter: grayscale(0.4);
                margin-right: 2px;
              }
            }
          }
        }
        .blood{
          position: absolute;
          top: 10%;
          .image{
            display: block;
            width: 100%;
            margin: 0 auto;
            filter: brightness(0.8) grayscale(0.55);
          }
        }
      }
      .enemy:nth-child(n+5){
        .place {
          .stats{
            bottom: 0;
            top: unset;
            transform: translate(0,0) translateZ(60px) ;
            z-index: 1;
          }
        }
      }
    }
    .shadow{
      width: 100%;
      aspect-ratio: 1/1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-image: radial-gradient(rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.87) 60% );
    }
    .doorway{
      position: absolute;
      height: 80%;
      aspect-ratio: 1/1.8;
      left: 50%;
      transform: translateX(-50%);
      bottom: 0;
      border-image: url(../assets/doorway.png) 20 / 10px 10px 0 10px / 10px repeat;
      filter: grayscale(0.4) brightness(0.55);
      perspective: 125px;
      .door{
        background-image: url(../assets/door.jpg);
        background-size: 100%;
        filter: grayscale(0.55) brightness(0.65);
        height: 100%;
        width: 100%;
        transform-origin: bottom;
        transition-timing-function: cubic-bezier(.18,1.2,.74,.92);
        perspective: 100px;
        overflow: hidden;
        position: relative;
        .image{
          position: absolute;
          max-width: 40%;
          left:50%;
          transform: translate(-50%,80%);
        }
        .after{
          position: absolute;
          height: 100%;
          width: 100%;
          background-image: linear-gradient(rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0) 100%);
          transition-timing-function: cubic-bezier(.18,1.2,.74,.92);
          opacity: 0;
        }
      }
    }
    .brick{
      height: 100%;
      width: 100%;
      background-image: url(../assets/brickWall.jpg);
      background-repeat: repeat;
      background-size: 35%;
      clip-path:polygon(0% 0%, 0% 100%, 256px 100%, 256px 40px, 344px 40px, 344px 100%, 100% 100%, 100% 0%);
    }
  }
  .wall:nth-child(1){
    transform:translateZ(-300px);
  }
  .wall:nth-child(2){
    transform:translateZ(300px) rotateY(180deg);
    .door{
      display: none;
    }
  }
  .wall:nth-child(3){
    transform:rotateY(90deg) translateX(-300px);
    transform-origin: 0 0;
  }
  .wall:nth-child(4){
    transform:rotateY(-90deg) translateX(300px);
    right: 0;
    transform-origin: 100% 100%;
  }
  .wall:nth-child(5){
    height:600px;
    transform:rotateX(-90deg) translateY(-300px);
    background-image:url(../assets/ceiling.jpg);
    background-repeat: round;
    background-size: 10%;
    filter: brightness(0.35) blur(0.6px);
    transform-origin: 0 0;
    .shadow{
      background-image: radial-gradient(rgba(0,0,0,0) 0%,rgba(0,0,0,0.9) 80% );
    }
  }
  .wall:nth-child(6){
    height:1200px;
    width:1200px;
    transform:rotateX(90deg) translateY(600px) translateX(-300px);
    filter:unset;
    bottom: 0;
    transform-origin:100% 100%;
    .tiles{
      width: 100%;
      height: 100%;
      filter: brightness(1.1) grayscale(80%);//
      background-image: url(../assets/floor.jpg);
      background-size: 10%;
      background-repeat: repeat;
      .doorFlat{
        position: absolute;
        height: 160px;
        aspect-ratio: 1/1.8;
        background-image: url(../assets/door.jpg);
        filter: brightness(0.2) blur(0.5px);
        background-size: 100%;
        top: 50%;
        left: 50%;
      }
      .shadow{
        background-image: radial-gradient(rgba(0,0,0,0) 0%,rgba(0,0,0,1) 50%);
        filter: brightness(1.1) grayscale(80%);//
      }
    }
  }
  .bulb{
    background-image: url(../assets/bulb.png);
    background-size: 20px;
    position: absolute;
    left: 50%;
    height: 35px;
    width: 20px;
    transform: translateX(-50%) rotateX(180deg);
    transition: 1s;
  }
  .bulb::after{
    content: "";
    display: block;
    width: 2px;
    height: 15px;
    background-color: rgb(29, 28, 28);
    margin: 18px auto 0 auto;
  }
  .bulb::before{
    content: "";
    display: block;
    position: absolute;
    height: 80px;
    aspect-ratio: 1/1;
    top: 8px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: radial-gradient(rgba(206, 211, 161, 0.65) 0%,rgba(0,0,0,0) 50%);
  }
  .content{
    height: 70%;
    width: fit-content;
    position: absolute;
    bottom: 0;
    left:50%;
    transform: translate(-50%,0) translateX(-200px) translateZ(-200px) rotateY(45deg);
    transition: 1s;
    .image{
      height: 100%;
      display: block;
      margin: 0 auto;
    }
    .first{
      height: 33%;
      object-fit: contain;
      object-position:bottom;
      width: 45px;
      transform: translate(0,16px);
      filter: grayscale(0.5) brightness(0.3);
    }
    .second{
      height: 66%;
      transform: translate(0,8px);
      filter: brightness(0.4);
    }
    .third{
      filter: grayscale(0.8) brightness(0.35);
    }
    .fourth{
      position: absolute;
      bottom: 5px;
      left:50%;
      height: 30%;
      transform: translate(-50%,0);
    }
  }
}
.darkened{
  position: absolute;
  height: 300%;
  width: 100%;
  top: -100%;
  background-color: black;
}
.v-enter-from{
  opacity: 0;
}
.v-leave-to{
  animation: flicker 1.6s ease 0.7s;
}
.v-leave-from, .v-enter-to{
  opacity: 1;
}
.v-enter-active{
  transition: 1s;
}
@keyframes flicker {
  0% { opacity: 1; }
  5% { opacity: 0.9 }
  10% { opacity: 0.8; }
  15% { opacity: 0.7; }
  20% { opacity: 0.4; }
  25% { opacity: 0.6; }
  30% { opacity: 0.3; }
  35% { opacity: 0.5; }
  40% { opacity: 0.4; }
  45% { opacity: 0.5; }
  50% { opacity: 0.4; }
  55% { opacity: 0.6; }
  60% { opacity: 0.3; }
  65% { opacity: 0.6; }
  70% { opacity: 0.3; }
  80% { opacity: 0.2; }
  95% { opacity: 0.1; }
  100% { opacity: 0; }
}
.enemy-leave-to,.enemy-enter-from{
  opacity: 0;
}
.enemy-leave-from, .enemy-enter-to{
  opacity: 1;
}
.enemy-enter-active,.enemy-leave-active{
  transition: opacity 0.5s;
}
.effects-leave-to,.effects-enter-from{
  opacity: 0;
}
.effects-leave-from, .effects-enter-to{
  opacity: 1;
}
.effects-enter-active,.effects-leave-active{
  transition: opacity 0.5s;
}
</style>
