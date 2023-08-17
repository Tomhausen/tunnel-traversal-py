namespace SpriteKind {
    export const ground = SpriteKind.create()
}

//  variables
let gravity = 8
let game_speed = 50
let min_spawn_gap = 25
// 
let camera_offset = 64
let last_spawn_x : number = null
let camera_right = scene.cameraProperty(CameraProperty.Right)
//  ground
let bottom = sprites.create(assets.image`bottom`, SpriteKind.ground)
bottom.bottom = 120
bottom.vx = game_speed
let top = sprites.create(assets.image`bottom`, SpriteKind.Player)
// 
top.image.fill(2)
// 
top.top = 0
// 
top.vx = game_speed
// 
//  player
let bot = sprites.create(assets.image`bot`, SpriteKind.Player)
bot.setPosition(16, 80)
bot.vx = game_speed
bot.z = -1
//  setup
scene.setBackgroundColor(1)
controller.A.onEvent(ControllerButtonEvent.Pressed, function jump() {
    if (bot.overlapsWith(bottom)) {
        bot.vy = -150
        timer.background(function clockwise_flip() {
            bot.y -= 5
            while (!bot.overlapsWith(bottom)) {
                transformSprites.changeRotation(bot, 10)
                pause(50)
            }
            transformSprites.rotateSprite(bot, 90)
        })
    }
    
    if (bot.overlapsWith(top)) {
        // 
        bot.vy = 150
        // 
        timer.background(function anticlockwise_flip() {
            bot.y += 5
            while (!bot.overlapsWith(top)) {
                transformSprites.changeRotation(bot, -10)
                pause(50)
            }
            transformSprites.rotateSprite(bot, 90)
        })
    }
    
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function switch_side() {
    // 
    if (bot.overlapsWith(bottom)) {
        bot.vy = -200
    }
    
    if (bot.overlapsWith(top)) {
        bot.vy = 200
    }
    
})
// 
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function hit_obstacle(bot: Sprite, obstacle: Sprite) {
    game.over(true)
})
function spawn_obstacle() {
    
    let obstacle = sprites.create(assets.image`blue obstacle`, SpriteKind.Enemy)
    obstacle.bottom = 110
    if (randint(1, 2) == 1) {
        // 
        obstacle.setImage(assets.image`red obstacle`)
        // 
        obstacle.top = 10
    }
    
    // 
    obstacle.left = camera_right - 5
    last_spawn_x = obstacle.left
    obstacle.setFlag(SpriteFlag.AutoDestroy, true)
}

spawn_obstacle()
function move_camera() {
    
    scene.centerCameraAt(bot.x + camera_offset, 60)
    camera_right = scene.cameraProperty(CameraProperty.Right)
}

function y_movement() {
    //  bot.vy += gravity
    if (bot.y > 60) {
        // 
        bot.vy += gravity
    } else {
        // 
        // 
        bot.vy -= gravity
    }
    
}

// 
function hit_floor(floor: any) {
    if (bot.overlapsWith(floor)) {
        while (bot.overlapsWith(floor)) {
            bot.y -= bot.vy / Math.abs(bot.vy)
        }
        bot.y += bot.vy / Math.abs(bot.vy)
        bot.vy = 0
    }
    
}

game.onUpdate(function tick() {
    move_camera()
    if (camera_right - last_spawn_x > min_spawn_gap) {
        if (randint(1, 15) == 1) {
            spawn_obstacle()
        }
        
    }
    
    y_movement()
    hit_floor(top)
    //  
    hit_floor(bottom)
    info.changeScoreBy(1)
})
