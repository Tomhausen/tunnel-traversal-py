@namespace
class SpriteKind:
    ground = SpriteKind.create()

# variables
gravity = 8
game_speed = 50
min_spawn_gap = 25 #
camera_offset = 64
last_spawn_x: number = None
camera_right = scene.camera_property(CameraProperty.RIGHT)

# ground
bottom = sprites.create(assets.image("bottom"), SpriteKind.ground)
bottom.bottom = 120
bottom.vx = game_speed
top = sprites.create(assets.image("bottom"), SpriteKind.player) #
top.image.fill(2) #
top.top = 0 #
top.vx = game_speed #

# player
bot = sprites.create(assets.image("bot"), SpriteKind.player)
bot.set_position(16, 80)
bot.vx = game_speed
bot.z = -1

# setup
scene.set_background_color(1)

def clockwise_flip():
    bot.y -= 5
    while not bot.overlaps_with(bottom):
        transformSprites.change_rotation(bot, 10)
        pause(50)
    transformSprites.rotate_sprite(bot, 90)

def anticlockwise_flip():
    bot.y += 5
    while not bot.overlaps_with(top):
        transformSprites.change_rotation(bot, -10)
        pause(50)
    transformSprites.rotate_sprite(bot, 90)

def jump():
    if bot.overlaps_with(bottom):
        bot.vy = -150
        timer.background(clockwise_flip)
    if bot.overlaps_with(top): #
        bot.vy = 150 #
        timer.background(anticlockwise_flip)
controller.A.on_event(ControllerButtonEvent.PRESSED, jump)

def switch_side(): #
    if bot.overlaps_with(bottom):
        bot.vy = -200
    if bot.overlaps_with(top):
        bot.vy = 200
controller.B.on_event(ControllerButtonEvent.PRESSED, switch_side) #

def hit_obstacle(bot, obstacle):
    game.over(True)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, hit_obstacle)

def spawn_obstacle():
    global last_spawn_x
    obstacle = sprites.create(assets.image("blue obstacle"), SpriteKind.enemy)
    obstacle.bottom = 110
    if randint(1, 2) == 1: #
        obstacle.set_image(assets.image("red obstacle")) #
        obstacle.top = 10 #
    obstacle.left = camera_right - 5
    last_spawn_x = obstacle.left
    obstacle.set_flag(SpriteFlag.AUTO_DESTROY, True)
spawn_obstacle()

def move_camera():
    global camera_right
    scene.center_camera_at(bot.x + camera_offset, 60)
    camera_right = scene.camera_property(CameraProperty.RIGHT)

def y_movement():
    # bot.vy += gravity
    if bot.y > 60: #
        bot.vy += gravity #
    else: #
        bot.vy -= gravity #

def hit_floor(floor):
    if bot.overlaps_with(floor):
        while bot.overlaps_with(floor):
            bot.y -= bot.vy / Math.abs(bot.vy)
        bot.y += bot.vy / Math.abs(bot.vy)
        bot.vy = 0

def tick():
    move_camera()
    if camera_right - last_spawn_x > min_spawn_gap:
        if randint(1, 15) == 1:
            spawn_obstacle()
    y_movement()
    hit_floor(top) # 
    hit_floor(bottom)
    info.change_score_by(1)
game.on_update(tick)
