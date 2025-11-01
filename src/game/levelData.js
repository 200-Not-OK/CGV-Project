// Data-driven level definitions with GLTF geometry loading
export const levels = [
      {
    "id": "intro",
    "name": "Intro Level",
    "order": 1,
    "gltfUrl": "assets/levels/introLevel.gltf",
    "startPosition": [
      0,
      15,
      8
    ],
    "ui": [
      "hud",
      "fps",
      {
        "type": "collectibles",
        "config": {
          "applesTotal": 12,
          "potionsStart": 2,
          "pointsPerApple": 150,
          "collectibleTypes": {
            "apples": {
              "icon": "🍎",
              "name": "Red Apples",
              "color": "#ff6b6b",
              "completeColor": "#51cf66",
              "completeIcon": "🏆"
            },
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#4dabf7",
              "lowColor": "#ffd43b",
              "emptyColor": "#ff6b6b",
              "emptyIcon": "💔"
            }
          }
        }
      }
    ],
    "lights": [
      {
        "key": "BasicLights",
        "props": {
          "intensity": 0.1
        }
      }
    ],
    "enemies": [
      {
        "type": "snake",
        "position": [
          -5,
          0.5,
          5
        ],
        "modelUrl": "assets/enemies/snake/scene.gltf",
        "patrolPoints": [
          [
            -5,
            1,
            5,
            0.3
          ],
          [
            -8,
            1,
            8,
            0.3
          ],
          [
            -3,
            1,
            10,
            0.3
          ]
        ],
        "speed": 8,
        "chaseRange": 10,
        "health": 35
      }
    ],
    "colliders": [
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          0,
          2,
          0
        ],
        "size": [
          11.6,
          0.1,
          6
        ],
        "rotation": [
          44,
          0,
          0
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          0,
          0,
          0
        ],
        "size": [
          42.917484283447266,
          0.5594812631607056,
          38.855934143066406
        ],
        "materialType": "ground",
        "meshName": "collider_playground"
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          -21.06,
          3.44,
          0
        ],
        "size": [
          0.7933826446533203,
          6.32648104429245,
          38.855934143066406
        ],
        "materialType": "wall",
        "meshName": "collider_playground001"
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          0,
          3.44,
          -19.03
        ],
        "size": [
          42.917484283447266,
          6.32648104429245,
          0.7933826446533203
        ],
        "materialType": "wall",
        "meshName": "collider_playground002"
      },
      {
        "id": "collider_13",
        "type": "box",
        "position": [
          0,
          3.44,
          19.03
        ],
        "size": [
          42.917484283447266,
          6.32648104429245,
          0.7933826446533203
        ],
        "materialType": "wall",
        "meshName": "collider_playground004"
      },
      {
        "id": "collider_14",
        "type": "box",
        "position": [
          21.06,
          3.44,
          0
        ],
        "size": [
          0.7933826446533203,
          6.32648104429245,
          38.855934143066406
        ],
        "materialType": "wall",
        "meshName": "collider_playground003"
      }
    ],
    "cinematics": {
      "onLevelStart": {
        "type": "dialogue",
        "character": "narrator",
        "lines": [
          {
            "text": "Welcome to the training grounds!",
            "duration": 3000
          },
          {
            "text": "Use WASD to move and Space to jump.",
            "duration": 4000
          }
        ]
      },
      "onEnemyDefeat": {
        "type": "cutscene",
        "cameraPath": [
          {
            "position": [
              10,
              5,
              10
            ],
            "lookAt": [
              0,
              0,
              0
            ],
            "duration": 2000
          }
        ],
        "dialogue": [
          {
            "character": "player",
            "text": "One down, more to go!",
            "duration": 2000
          }
        ]
      }
    },
    "sounds": {
      "music": {
        "intro-theme": {
          "url": "assets/audio/music/whispers_beneath_the_canopy.mp3",
          "loop": true
        }
      },
      "sfx": {
        "sword": {
          "url": "assets/audio/sfx/sword.mp3",
          "loop": false
        },
        "chest": {
          "url": "assets/audio/sfx/chest_open.mp3",
          "loop": false
        },
        "snake": {
          "url": "assets/audio/sfx/snake.wav",
          "loop": false
        },
        "potion": {
          "url": "assets/audio/sfx/potion.wav",
          "loop": false
        },
        "walk": {
          "url": "assets/audio/sfx/walking.mp3",
          "loop": false
        },
        "jump": {
          "url": "assets/audio/sfx/jumping.wav",
          "loop": false
        }
      },
      "playMusic": "intro-theme"
    }
  },
  {
    "id": "level1",
    "name": "Level 1",
    "gltfUrl": "assets/levels/revamped/Level1.gltf",
    "panoramaSky": "assets/galaxy-night-landscape.jpg",  // Simple format

    "startPosition": [
      0,
      12,
      0
    ],
    "lights": [
      {
        "key": "TechLights",
        "props": {
          "position": [
            0,
            0,
            0
          ]
        }
      },
      {
        "key": "BasicLights",
        "props": {
          "intensity": 0.6
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [
            0,
            22,
            0
          ],
          "color": 8965375,
          "intensity": 3,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [
            0,
            22,
            -25
          ],
          "color": 8965375,
          "intensity": 2.5,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            12.912955239766767,
            37.88715128438456,
            -0.6576220834419964
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.5,
          "length": 18
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            12.944228948310343,
            36.3885593052973,
            -0.7342901183469568
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.6,
          "length": 16,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.771536745930266,
            37.10794565203993,
            -0.2786261734922153
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.45,
          "length": 20,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.786166101517708,
            35.637551218443186,
            0.09513458030733979
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.55,
          "length": 17,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            11.918973319923648,
            32.82629147937733,
            -0.5821365533665996
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.7,
          "length": 15,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.380822352048272,
            32.98950836127626,
            0.30395344141215386
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.4,
          "length": 22,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -7.066101073891365,
            39.086951601572,
            -1.202468494343286
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.65,
          "length": 19,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -7.654338940706618,
            39.1165865627044,
            0.7016923973175011
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.52,
          "length": 21,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            7.062490970189732,
            38.89875358023083,
            -1.4657143172867606
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.48,
          "length": 17.5,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            6.6347481289407355,
            38.869158640436886,
            1.324692383072716
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.58,
          "length": 19.5,
          "branches": 5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.13807616959711,
            19.463404294493557,
            -25.823032754301256
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.16909747940394,
            19.463404294493557,
            -27.13562457148415
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.19859913312111,
            19.463404294493557,
            -28.453574585960094
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.14985223550229,
            19.463404294493557,
            -29.66304109539178
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.24519648095297,
            19.463404294493557,
            -31.030929245129776
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.23451972231483,
            19.463404294493557,
            -32.12921366927179
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.20699800401285,
            19.463404294493557,
            -33.31666531646326
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.56784082247674,
            19.463404294493557,
            -26.342960488002813
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.608876255091346,
            19.463404294493557,
            -27.791121946094922
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.651721009570444,
            19.463404294493557,
            -29.038673863085236
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.821846110202166,
            19.463404294493557,
            -30.411332975256368
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.79240656912321,
            19.463404294493557,
            -31.410144903763197
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.98665721682491,
            19.463404294493557,
            -32.763087823485215
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.77547883082075,
            19.463404294493557,
            -33.87862076073715
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      }
    ],
    "ui": [
      "hud",
      {
        "type": "minimap",
        "config": {
          "zoom": 5,
        }
      },
      {
        "type": "collectibles",
        "config": {
          "applesTotal": 7,
          "potionsStart": 5,
          "pointsPerApple": 200,
          "collectibleTypes": {
            "apples": {
              "icon": "🍏",
              "name": "Green Apples",
              "color": "#51cf66",
              "completeColor": "#ffd43b",
              "completeIcon": "👑"
            },
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#9775fa",
              "lowColor": "#ffd43b",
              "emptyColor": "#ff6b6b",
              "emptyIcon": "💔"
            }
          }
        }
      }
    ],
    "enemies": [
      {
        "type": "crawler",
        "position": [
          -425.5900434110422,
          20.113008499145508,
          274.669088469345
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 8,
        "chaseRange": 10,
        "id": 29
      },
      {
        "type": "crawler",
        "position": [
          -426.66473887928464,
          20.113008499145515,
          244.20925144592724
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 8,
        "chaseRange": 10,
        "id": 31
      },
      {
        "type": "crawler",
        "position": [
          300.3535217944027,
          20.959493637084961,
          25.74999179342933
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 8,
        "chaseRange": 10,
        "id": 49
      },
      {
        "type": "crawler",
        "position": [
          300.14432266074226,
          20.509656195663787,
          121.99517109242474
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 8,
        "chaseRange": 10,
        "id": 51
      },
      {
        "type": "crawler",
        "position": [
          285.64077936042764,
          20.741729019436846,
          277.2949816103393
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 8,
        "chaseRange": 10,
        "id": 53
      }
    ],
    "npcs": [
      {
        "type": "yellow_bot",
        "position": [
          6.350443774254943,
          9.439203262329102,
          -25.949882425660608
        ],
        "modelUrl": "assets/npc/yellow_bot/scene.gltf",
        "patrolPoints": [],
        "speed": 2,
        "scale": 10,
        "chaseRange": 0,
        "id": 2
      },
      {
        "type": "other_bot",
        "position": [
          13.563743283481266,
          11.439203262329102,
          -35.625234114583954
        ],
        "modelUrl": "assets/npc/other_bot/Mike.gltf",
        "patrolPoints": [],
        "speed": 2,
        "scale": 1,
        "chaseRange": 0,
        "id": 3
      }
    ],
    "platforms": [],
    "interactiveObjects": [
      {
        "id": "interactive_3",
        "objectType": "pressurePlate",
        "position": [
          -493.6651629419319,
          10.113008499145508,
          292.94097499910407
        ],
        "size": 10,
        "activationWeight": 40,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_4",
        "objectType": "pressurePlate",
        "position": [
          -494.145160650115,
          10.113008499145508,
          267.5963964375436
        ],
        "size": 10,
        "activationWeight": 10,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_5",
        "objectType": "pressurePlate",
        "position": [
          -493.6658502474449,
          10.113008499145508,
          247.13187696380177
        ],
        "size": 10,
        "activationWeight": 40,
        "pressedHeight": -0.1,
        "color": 65280
      }
    ],
    "triggers": [],
    "meshAnimations": [
      {
        "meshName": "Lift2",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -225.86,
              10.11,
              124.18
            ],
            [
              -229.68,
              9.65,
              254.86
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -223.34,
              24.44,
              94.46
            ],
            [
              -387.15,
              10.11,
              184.13
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -496.88,
              11.9,
              195.35
            ],
            [
              -506.55,
              48.81,
              192.95
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3001",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              344.83,
              10.11,
              -36.05
            ],
            [
              544.8,
              22.52,
              -33.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3002",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              557.24,
              10.11,
              99.12
            ],
            [
              558.04,
              9.65,
              405.84
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3003",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              525.43,
              10.11,
              419.27
            ],
            [
              334.2,
              9.69,
              432.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "TreeNode2",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      },
      {
        "meshName": "TreeNode1",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      }
    ],
    "colliders": [
      {
        "id": "collider_2",
        "type": "box",
        "position": [
          0,
          8.439203262329102,
          -10.976917266845703
        ],
        "size": [
          74.21695709228516,
          2.000000033833089,
          74.21695709228516
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          0,
          23.242176055908203,
          -1.9201059341430664
        ],
        "size": [
          2,
          10.32878589630127,
          2
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_4",
        "type": "box",
        "position": [
          0,
          27.362017565243946,
          -2.9135963916778564
        ],
        "size": [
          20.964557647705078,
          35.83751362866792,
          10.630075931549072
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Platform",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Platform2",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Platform8",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform4",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_13",
        "type": "mesh",
        "meshName": "Lift2",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_14",
        "type": "mesh",
        "meshName": "Lift3",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "mesh",
        "meshName": "Platform5",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "mesh",
        "meshName": "Leaf",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "mesh",
        "meshName": "Lift",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "mesh",
        "meshName": "Platform7",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "mesh",
        "meshName": "Elevated_Ground",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_2",
        "type": "mesh",
        "meshName": "Platform001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_3",
        "type": "mesh",
        "meshName": "Platform002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_4",
        "type": "mesh",
        "meshName": "Platform3002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "Cube",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Lift3001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform4001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform3003",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Lift3002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3004",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Lift3003",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform3006",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      }
    ],
    "placeableBlocks": [
      {
        "id": "block_2",
        "type": "placeableBlock",
        "color": 16729156,
        "colorName": "red",
        "position": [
          -452.98549867511366,
          31,
          278.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -452.98549867511366,
          40,
          278.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      },
      {
        "id": "block_3",
        "type": "placeableBlock",
        "color": 6448255,
        "colorName": "blue",
        "position": [
          -438.98549867511366,
          31,
          252.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -438.98549867511366,
          40,
          252.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      },
      {
        "id": "block_4",
        "type": "placeableBlock",
        "color": 43520,
        "colorName": "green",
        "position": [
          -456.98549867511366,
          31,
          265.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -456.98549867511366,
          40,
          265.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      }
    ],
    "collectibles": {
      "chests": [
        {
          "id": "chest_32",
          "position": [
            -499.085311265958,
            38.74439334869385,
            334.06633057575175
          ],
          "contents": "apple"
        },
        {
          "id": "chest_33",
          "position": [
            -225.62864531854856,
            9.651255130767824,
            278.7988147172013
          ],
          "contents": "apple"
        },
        {
          "id": "chest_34",
          "position": [
            -237.44661100161906,
            23.226380348205566,
            -17.687950706826655
          ],
          "contents": "apple"
        },
        {
          "id": "chest_35",
          "position": [
            -238.27040579662082,
            23.226380348205566,
            -23.327350349487794
          ],
          "contents": "potion"
        },
        {
          "id": "chest_37",
          "position": [
            -237.8768482421618,
            23.226380348205566,
            -30.485315919861755
          ],
          "contents": "potion"
        },
        {
          "id": "chest_38",
          "position": [
            -169.3996665850923,
            9.651255130767822,
            -82.64101963921365
          ],
          "contents": "apple"
        },
        {
          "id": "chest_39",
          "position": [
            -26.238882996084904,
            9.439203262329102,
            -44.85368840875811
          ],
          "contents": "apple"
        },
        {
          "id": "chest_40",
          "position": [
            27.87669681671055,
            9.439203262329102,
            -45.742070533768135
          ],
          "contents": "apple"
        },
        {
          "id": "chest_41",
          "position": [
            563.1453318104104,
            23.226380348205566,
            46.48808928837561
          ],
          "contents": "potion"
        },
        {
          "id": "chest_42",
          "position": [
            567.1970196438438,
            9.651255130767822,
            429.1261757803478
          ],
          "contents": "potion"
        },
        {
          "id": "chest_43",
          "position": [
            317.9556895504127,
            9.691577911376953,
            402.88531324057374
          ],
          "contents": "potion"
        },
        {
          "id": "chest_44",
          "position": [
            274.4610301937911,
            9.691577911376955,
            406.2805544583855
          ],
          "contents": "potion"
        },
        {
          "id": "chest_45",
          "position": [
            272.8105836219984,
            9.691577911376951,
            417.24719695393435
          ],
          "contents": "potion"
        },
        {
          "id": "chest_46",
          "position": [
            319.2518496027569,
            9.691577911376955,
            417.44962917460015
          ],
          "contents": "apple"
        },
        {
          "id": "chest_47",
          "position": [
            275.60067626746354,
            9.691577911376953,
            -62.93518485094077
          ],
          "contents": "potion"
        }
      ],
      "potions": [],
      "coins": [],
      "gems": [],
      "keys": []
    }
  },
  {
    "id": "level2",
    "name": "Level 2: The Serpent's Labyrinth",
    "order": 0,
    "gltfUrl": "assets/levels/Level2/Level2.gltf",
    "panoramaSky": { "url": "assets/HDR_asteroid_field.hdr", "radius": 1000, "rotation": 0 },
    "startPosition": [
      195,
      6,
      -83
    ],
    "ui": [
      "hud",
      {
        "type": "minimap",
        "config": {
          "zoom": 1.6
        }
      },
      {
        "type": "collectibles",
        "config": {
          "applesTotal": 5,
          "potionsStart": 5,
          "pointsPerApple": 200,
          "collectibleTypes": {
            "apples": {
              "icon": "🍏",
              "name": "Green Apples",
              "color": "#51cf66",
              "completeColor": "#ffd43b",
              "completeIcon": "👑"
            },
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#9775fa",
              "lowColor": "#ffd43b",
              "emptyColor": "#ff6b6b",
              "emptyIcon": "💔"
            }
          }
        }
      }
    ],
    "lights": [
      {
        "key": "StarLight",
        "props": {
          "position": [
            -12.025823053848388,
            15.124568762727346,
            178.1670737408198
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            107.02806399789891,
            15.185896041341389,
            162.76484097209587
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            37.3222404385603,
            15.124568762727346,
            120.04517725703103
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            130.9762479960251,
            15.124568762727346,
            124.34771920664302
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            130.82457819522133,
            15.149992735917541,
            131.6524554717438
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            25.759123747308454,
            15.161363815776973,
            57.40978236364007
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            113.60075814069711,
            15.124568762727346,
            75.45198084352933
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            45.84881244172108,
            15.161363806448112,
            18.457558176388886
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            163.83881610949769,
            15.227661212603742,
            94.95998318210349
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            240.16020953998367,
            15.161363806448094,
            76.45611044544076
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            239.88417501943894,
            15.161363806448112,
            -0.5912993552164365
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            193.86038360355045,
            15.161363806448112,
            -34.19794303311772
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            40.11368964583366,
            17.308840240606493,
            17.848062963685287
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "PointPulse",
        "props": {
          "position": [
            25.9,
            8,
            -4.5
          ],
          "color": 16737792,
          "intensity": 2,
          "distance": 15,
          "speed": 3
        }
      },
      {
        "key": "PointPulse",
        "props": {
          "position": [
            56.5,
            8,
            -9.4
          ],
          "color": 16737792,
          "intensity": 2,
          "distance": 15,
          "speed": 2.8
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            145.374145581186,
            5.804794296862261,
            11.882736073091916
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            134.718151932843,
            5.78268465742263,
            11.873464661495646
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            122.78516775876871,
            5.8474919952326525,
            -25.81796271767555
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            122.75289002363303,
            5.824311796058366,
            -36.01769063926521
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            134.79668037901118,
            5.831041284225208,
            -10.272701839548002
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            145.54804548665086,
            5.8339097924993535,
            -10.276329057023784
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            159.64732128633787,
            5.9357392145356025,
            -25.767635617352212
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            159.64663134792835,
            5.930372938679281,
            -36.04501493705355
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            187.78189640126286,
            5.035426533687112,
            -67.44935354436615
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            203.18593802560247,
            5.048047534339984,
            -67.47103610381599
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.70471656341971,
            5.8849883912178385,
            -38.4618296114502
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.88480904996993,
            5.6559444764186875,
            -30.103860185871703
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.83320893498765,
            5.721480316701198,
            -21.880698367170048
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            43.38295419129252,
            5.7420850327988315,
            -6.875723878004884
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            35.086182852268365,
            5.6551266296830685,
            -6.808340860162892
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            16.001505350542764,
            5.613292466314125,
            -6.759154512626444
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            7.0153821498284445,
            5.669436370044735,
            -6.841128185313431
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.11166590370448343,
            5.7438761097532876,
            -13.588768247718344
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.04525689946449157,
            5.599711198663363,
            -21.77999583757773
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.09954785225139173,
            5.7058433319904465,
            -30.075894906304015
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.0996039348799318,
            5.618667104333225,
            -38.20669516180944
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            91.9121400525824,
            5.5043045497272765,
            69.33307068033353
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            91.51432073396393,
            5.562602432290042,
            83.21989440009406
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            92.90541521601358,
            5.506758574108859,
            114.40778822379639
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            82.56781117153821,
            5.440672710092432,
            114.15160209205409
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            19.853359171024938,
            5.473284686564114,
            174.6788413619447
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            46.18353898830183,
            5.520312449833668,
            165.2070604462412
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            73.35210557060873,
            5.447575131243129,
            163.71518970921977
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            31.061820073507484,
            5.508550899910855,
            165.3792369084329
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            166.53481479466527,
            5.57478373643869,
            32.45325588393239
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            166.49003849952368,
            5.607541597099899,
            42.969325896
          ],
          "particleCount": 10
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            83.43254766317186,
            1.2057601587692057,
            111.77327652375475
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            83.36469817213991,
            1.2837301509369499,
            105.26460041098828
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.93749187886783,
            1.3245305189437893,
            105.4131052066785
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            92.01687998314709,
            1.2738924665817104,
            103.8530075210911
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.93445268528446,
            1.1468793128405508,
            99.84808244835246
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            76.8348612416366,
            1.1690747691887304,
            136.6856170131267
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            86.72046111617131,
            1.1568386427489756,
            136.6394145696907
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            43.16081674167087,
            1.2209428415269354,
            173.82469978882676
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            47.248717558787604,
            1.215091691338967,
            173.9365686334229
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            33.54359217925317,
            1.2684842742320261,
            173.86320290989576
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            27.962142718073412,
            1.2475184889173712,
            173.7379627763736
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            27.901049520849455,
            1.2410534857407918,
            165.32341602390284
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            29.50983264071492,
            1.0855084875448937,
            173.79064853608793
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.653955461457368,
            1.335990593395947,
            173.83289340256317
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.432948856916415,
            1.2901892043725935,
            165.29445978090334
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.589232408805948,
            1.1198598939653714,
            47.73786196842747
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.706710753144954,
            1.210215805905272,
            43.60889604601839
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.660677775299362,
            1.1023718397493927,
            34.31194906619159
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.63143393707036,
            1.1242937196725413,
            30.207751318766427
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.597538914819626,
            1.239614254889096,
            3.8544445540238788
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            30.165402325457187,
            1.2733517314603309,
            4.028640010477144
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            82.74369785979741,
            1.2034744995497018,
            -20.95165217270131
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.34355557777239,
            1.1615141852497464,
            -20.85240575533394
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.3777859516799,
            1.114140558774249,
            14.772258208550278
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.36108239718956,
            1.1770794874358907,
            14.81711214854276
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.88521202137773,
            1.1240535256298756,
            14.802388272582611
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            210.98731822288883,
            1.1948395727054164,
            14.761609953261308
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.4715987963806,
            1.1822178903789826,
            29.04207923290771
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.46850876190013,
            1.2181301539013119,
            32.94598130834198
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.42559485440637,
            1.1891704632705762,
            42.42033989301887
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.4907449690739,
            1.1519639880645105,
            46.7048155345102
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            210.8989220530201,
            1.311559575994403,
            60.86318304106383
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.69803220092484,
            1.1479738139653146,
            60.69789116499635
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.50778540340613,
            1.2654254234350866,
            60.92830557604289
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            191.78947455535467,
            1.2749757215178599,
            60.87365108168619
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.33186633788972,
            1.2245386546324122,
            60.8548883958861
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            191.9705364266468,
            1.1724918117894392,
            52.32504686468006
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            185.3635425903781,
            1.2253986693052052,
            60.87219511164419
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            211.95444995536872,
            1.2066072460699182,
            79.18318396149154
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            215.96929948212698,
            1.1057289410892723,
            79.2154750209055
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            225.31042463564654,
            1.2774561341042998,
            79.34945366129405
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            229.50486855612542,
            1.1408690237743233,
            79.1650620371092
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            234.96679274350097,
            1.3025838129933796,
            59.961916586274874
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            234.99701732370139,
            1.3603076492769484,
            65.11817820324278
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            243.43501109998562,
            1.1988560885186335,
            64.98130416169266
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            243.3879196285108,
            1.3115789654224153,
            59.929574626867
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.97170953818862,
            1.1609243582644542,
            30.345325977895833
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.84173408543633,
            1.0301794412424936,
            34.43992916530665
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            49.02306292406539,
            1.2221312128210777,
            43.76446997096573
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.98097966483144,
            1.336698357713803,
            47.87445208866004
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.2713699522292,
            1.1566013820618113,
            14.821601434415163
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            196.12370846579444,
            2.676754784929564,
            14.570970839037999
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.3569011448118,
            1.1710099136056555,
            14.834863149356453
          ]
        }
      }
    ],
    "sounds": {
      "music": {
        "level2-theme": {
          "url": "assets/audio/music/whispers_beneath_the_canopy.mp3",
          "loop": true
        }
      },
      "sfx": {
        "door": {
          "url": "assets/audio/sfx/door.mp3",
          "loop": false
        },
        "torch": {
          "url": "assets/audio/ambient/torch.mp3",
          "loop": false
        },
        "chest": {
          "url": "assets/audio/sfx/chest_open.mp3",
          "loop": false
        },
        "snake": {
          "url": "assets/audio/sfx/snake.wav",
          "loop": false
        },
        "potion": {
          "url": "assets/audio/sfx/potion.wav",
          "loop": false
        },
        "low-health": {
          "url": "assets/audio/sfx/low_health.mp3",
          "loop": false
        },
        "rumbling": {
          "url": "assets/audio/sfx/rumbling.wav",
          "loop": false
        },
        "vo-levelstart": {
          "url": "assets/audio/ambient/pravesh_levelstart_vo.mp3",
          "loop": false
        },
        "vo-maze": {
          "url": "assets/audio/ambient/pravesh_01.mp3",
          "loop": false
        },
        "vo-chest": {
          "url": "assets/audio/ambient/pravesh_02.mp3",
          "loop": false
        },
        "vo-lastchest": {
          "url": "assets/audio/ambient/pravesh_05.mp3",
          "loop": false
        },
        "vo-fail": {
          "url": "assets/audio/ambient/pravesh_fail_vo.mp3",
          "loop": false
        },
        "vo-success": {
          "url": "assets/audio/ambient/pravesh_success_vo.mp3",
          "loop": false
        }
      },
      "ambient": {
        "torch-ambient": {
          "url": "assets/audio/ambient/torch.mp3",
          "loop": true
        }
      },
      "playMusic": "level2-theme",
      "playVoiceover": null
    },
    "cinematics": {
      "onLevelStart": {
        "sequence": [
          {
            "type": "takeCamera"
          },
          {
            "type": "fadeOut",
            "ms": 300
          },
          {
            "type": "cut",
            "position": [
              196.2,
              6.9,
              -82.2
            ],
            "lookAt": [
              195,
              5.8,
              -83
            ],
            "fov": 48
          },
          {
            "type": "fadeIn",
            "ms": 600
          },
          {
            "type": "playVO",
            "vo": "vo-levelstart",
            "block": true,
            "segments": [
              {
                "at": 0,
                "ms": 2000,
                "text": "Hey everybody, welcome to the Serpent’s Labyrinth."
              },
              {
                "at": 2400,
                "ms": 2700,
                "text": "You’re a knight now, in a world of stone walls and lurking dangers."
              },
              {
                "at": 5500,
                "ms": 2500,
                "text": "Inside, you’ll find apples hidden in chests."
              },
              {
                "at": 8500,
                "ms": 1500,
                "text": "They’re your key to escape."
              },
              {
                "at": 10000,
                "ms": 3500,
                "text": "But beware—the snakes that guard them are not ordinary creatures."
              },
              {
                "at": 14000,
                "ms": 6000,
                "text": "Each one slithers with its own cunning, and if they catch you—well, let's just say you won't be making it out alive."
              },
              {
                "at": 21000,
                "ms": 6000,
                "text": "And there’s talk of something far worse: a great beast, a serpent older than the labyrinth itself."
              },
              {
                "at": 27500,
                "ms": 3500,
                "text": "If you hear the ground tremble, don’t stick around to find out why."
              },
              {
                "at": 31500,
                "ms": 3500,
                "text": "Gather the apples, find the exit, and escape before it finds you."
              }
            ],
            "concurrent": [
              {
                "type": "wait",
                "ms": 1000
              },
              {
                "type": "orbit",
                "center": "player",
                "radius": 7.5,
                "startDeg": 30,
                "endDeg": 50,
                "height": 4.8,
                "duration": 12000
              },
              {
                "type": "wait",
                "ms": 1000
              },
              {
                "type": "cut",
                "position": [
                  137.00079992092608,
                  0.1245687627273453,
                  -39.95321271964637
                ],
                "lookAt": [
                  135.5589805717232,
                  0.1245687627273453,
                  -23.224077180845633
                ],
                "fov": 52
              },
              {
                "type": "fadeIn",
                "ms": 140
              },
              {
                "type": "orbit",
                "center": [
                  132.98057775780848,
                  0.1245687627273453,
                  -20.09886231664358
                ],
                "radius": 7,
                "startDeg": 75,
                "endDeg": 65,
                "height": 3,
                "duration": 5200
              },
              {
                "type": "wait",
                "ms": 1220
              },
              {
                "type": "cut",
                "position": [
                  72,
                  4,
                  -6
                ],
                "lookAt": [
                  68.89083005033424,
                  3,
                  -8
                ],
                "fov": 100
              },
              {
                "type": "orbit",
                "center": [
                  70.20661523837512,
                  3.5,
                  -7
                ],
                "radius": 2,
                "startDeg": 230,
                "endDeg": 180,
                "height": 3,
                "duration": 5200
              },
              {
                "type": "rumble",
                "sfx": "rumbling",
                "seconds": 1.2,
                "magnitude": 0.18,
                "volume": 0.7
              },
              {
                "type": "rumble",
                "sfx": "rumbling",
                "seconds": 1.1,
                "magnitude": 0.15,
                "volume": 0.6
              },
              {
                "type": "wait",
                "ms": 4000
              },
              {
                "type": "cut",
                "position": [
                  138,
                  4,
                  120
                ],
                "lookAt": [
                  135,
                  4,
                  116
                ],
                "fov": 100
              },
              {
                "type": "orbit",
                "center": [
                  138,
                  4,
                  120
                ],
                "radius": 2,
                "startDeg": 230,
                "endDeg": 180,
                "height": 1,
                "duration": 200
              },
              {
                "type": "fadeIn",
                "ms": 120
              }
            ]
          },
          {
            "type": "fadeOut",
            "ms": 250
          },
          {
            "type": "releaseCamera"
          },
          {
            "type": "fadeIn",
            "ms": 250
          }
        ]
      },
      "onLevelComplete": {
        "sequence": [
          {
            "type": "takeCamera"
          },
          {
            "type": "fadeOut",
            "ms": 200
          },
          {
            "type": "cut",
            "position": [
              32,
              6,
              -24
            ],
            "lookAt": [
              30,
              2,
              -25
            ],
            "fov": 60
          },
          {
            "type": "fadeIn",
            "ms": 300
          },
          {
            "type": "orbit",
            "center": "player",
            "radius": 6,
            "startDeg": 10,
            "endDeg": 70,
            "height": 3.2,
            "duration": 2500
          },
          {
            "type": "fadeOut",
            "ms": 250
          },
          {
            "type": "releaseCamera"
          },
          {
            "type": "fadeIn",
            "ms": 250
          }
        ]
      }
    },
    "proximitySounds": [
      {
        "position": [
          203,
          3.7,
          -66.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          187.9,
          3.7,
          -66.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          160.3,
          4.6,
          -36.1
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          160.3,
          4.6,
          -25.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      }
    ],
    "enemies": [
      {
        "type": "snake",
        "position": [
          140,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            140,
            1.4,
            -30
          ],
          [
            130,
            1.4,
            -20
          ],
          [
            150,
            1.4,
            -20
          ],
          [
            145,
            1.4,
            -35
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          151.97,
          1.4,
          28.12
        ],
        "patrolPoints": [
          [
            151.97,
            1.4,
            28.12
          ],
          [
            141.97,
            1.4,
            38.12
          ],
          [
            161.97,
            1.4,
            38.12
          ],
          [
            156.97,
            1.4,
            23.12
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          122.02,
          1.4,
          126.51
        ],
        "patrolPoints": [
          [
            122.02,
            1.4,
            126.51
          ],
          [
            112.02,
            1.4,
            136.51
          ],
          [
            132.02,
            1.4,
            136.51
          ],
          [
            127.02,
            1.4,
            121.51
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          88.65,
          1.4,
          165.63
        ],
        "patrolPoints": [
          [
            88.65,
            1.4,
            165.63
          ],
          [
            78.65,
            1.4,
            175.63
          ],
          [
            98.65,
            1.4,
            175.63
          ],
          [
            93.65,
            1.4,
            160.63
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          220.46,
          1.4,
          69.91
        ],
        "patrolPoints": [
          [
            220.46,
            1.4,
            69.91
          ],
          [
            210.46,
            1.4,
            79.91
          ],
          [
            230.46,
            1.4,
            79.91
          ],
          [
            225.46,
            1.4,
            64.91
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          -4.63,
          1.4,
          179.3
        ],
        "patrolPoints": [
          [
            -4.63,
            1.4,
            179.3
          ],
          [
            -14.63,
            1.4,
            189.3
          ],
          [
            5.37,
            1.4,
            189.3
          ],
          [
            0.37,
            1.4,
            174.3
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          75.63,
          1.4,
          -7.35
        ],
        "patrolPoints": [
          [
            75.63,
            1.4,
            -7.35
          ],
          [
            65.63,
            1.4,
            2.65
          ],
          [
            85.63,
            1.4,
            2.65
          ],
          [
            80.63,
            1.4,
            -12.35
          ]
        ],
        "health": 35,
        "speed": 8,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          30,
          2,
          -25
        ],
        "patrolPoints": [
          [
            30,
            2,
            -25
          ],
          [
            25,
            2,
            -20
          ],
          [
            35,
            2,
            -30
          ],
          [
            40,
            2,
            -20
          ],
          [
            25,
            2,
            -35
          ]
        ],
        "health": 500,
        "speed": 3,
        "chaseRange": 12
      }
    ],
    "collectibles": {
      "chests": [
        {
          "id": "chest_1",
          "position": [
            145,
            0.5,
            -46
          ],
          "contents": "apple"
        },
        {
          "id": "chest_2",
          "position": [
            146,
            0.5,
            49
          ],
          "contents": "apple"
        },
        {
          "id": "chest_3",
          "position": [
            108,
            0.5,
            86
          ],
          "contents": "potion"
        },
        {
          "id": "chest_4",
          "position": [
            103,
            0.5,
            125
          ],
          "contents": "apple"
        },
        {
          "id": "chest_5",
          "position": [
            135,
            0.5,
            116
          ],
          "contents": "potion"
        },
        {
          "id": "chest_6",
          "position": [
            18,
            0.5,
            179
          ],
          "contents": "apple"
        },
        {
          "id": "chest_7",
          "position": [
            110,
            0.5,
            163
          ],
          "contents": "apple"
        }
      ]
    },
    "colliders": [
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          195.56,
          0.16,
          -81.19
        ],
        "size": [
          23.3,
          0.1,
          29.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          195.28,
          0.16,
          -46.68
        ],
        "size": [
          8.7,
          0.1,
          39.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          176.17,
          0.16,
          -30.92
        ],
        "size": [
          29.5,
          0.1,
          9.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          141.24,
          0.16,
          -29.35
        ],
        "size": [
          40.3,
          0.1,
          41.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          147.94,
          0.12,
          30.85
        ],
        "size": [
          40.3,
          0.1,
          41
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          140.28,
          0.16,
          0.82
        ],
        "size": [
          10,
          0.1,
          19
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          120.78,
          0.16,
          0.71
        ],
        "size": [
          29.1,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          166.43,
          0.16,
          0.71
        ],
        "size": [
          42.3,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          202.09,
          0.14,
          19.4
        ],
        "size": [
          45.5,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          183.58,
          0.16,
          10.01
        ],
        "size": [
          9.4,
          0.1,
          10.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          220.77,
          0.16,
          5.92
        ],
        "size": [
          9,
          0.1,
          18.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_65",
        "type": "box",
        "position": [
          234.22,
          0.16,
          1.01
        ],
        "size": [
          17.9,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_66",
        "type": "box",
        "position": [
          182.49,
          0.16,
          37.8
        ],
        "size": [
          28.8,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_67",
        "type": "box",
        "position": [
          201.56,
          0.16,
          37.83
        ],
        "size": [
          9.3,
          0.1,
          28.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_68",
        "type": "box",
        "position": [
          197.8,
          0.16,
          56.49
        ],
        "size": [
          53.6,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_69",
        "type": "box",
        "position": [
          239.05,
          0.16,
          42.11
        ],
        "size": [
          9,
          0.1,
          73.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_70",
        "type": "box",
        "position": [
          216.35,
          0.16,
          75.37
        ],
        "size": [
          36.5,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_71",
        "type": "box",
        "position": [
          220.63,
          0.14,
          65.92
        ],
        "size": [
          9.5,
          0.1,
          9.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          201.88,
          0.22,
          84.35
        ],
        "size": [
          9,
          0.1,
          9.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          179.48,
          0.23,
          93.31
        ],
        "size": [
          53.3,
          0.1,
          8.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          156.61,
          0.23,
          80.1
        ],
        "size": [
          9,
          0.1,
          17.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          170.2,
          0.21,
          75
        ],
        "size": [
          18.2,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          174.8,
          0.23,
          66.01
        ],
        "size": [
          9,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          85.56,
          0.16,
          -1.19
        ],
        "size": [
          41.4,
          0.1,
          24.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          101.97,
          0.16,
          -30.91
        ],
        "size": [
          38.2,
          0.1,
          8.1
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          87.18,
          0.13,
          -20.24
        ],
        "size": [
          8.5,
          0.1,
          13.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          60.73,
          0.16,
          -9.4
        ],
        "size": [
          8.4,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_41",
        "type": "box",
        "position": [
          27.53,
          0.16,
          -30.07
        ],
        "size": [
          58,
          0.1,
          49.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_42",
        "type": "box",
        "position": [
          108.84,
          0.12,
          75.95
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_43",
        "type": "box",
        "position": [
          45.12,
          0.12,
          123.13
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_44",
        "type": "box",
        "position": [
          125.69,
          0.12,
          125.06
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_45",
        "type": "box",
        "position": [
          85.39,
          0.12,
          125
        ],
        "size": [
          40.5,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_46",
        "type": "box",
        "position": [
          109.64,
          0.12,
          116.75
        ],
        "size": [
          8.1,
          0.1,
          8.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_47",
        "type": "box",
        "position": [
          61.1,
          0.12,
          116.8
        ],
        "size": [
          8.1,
          0.1,
          8.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_48",
        "type": "box",
        "position": [
          92.8,
          0.12,
          162.33
        ],
        "size": [
          40.4,
          0.1,
          24.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_49",
        "type": "box",
        "position": [
          0.51,
          0.12,
          176.77
        ],
        "size": [
          40.4,
          0.1,
          22.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_50",
        "type": "box",
        "position": [
          46.63,
          0.16,
          169.52
        ],
        "size": [
          51.9,
          0.2,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_51",
        "type": "box",
        "position": [
          38.39,
          0.16,
          150.49
        ],
        "size": [
          8.2,
          0.1,
          29.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_52",
        "type": "box",
        "position": [
          26,
          0.16,
          33.28
        ],
        "size": [
          8.4,
          0.2,
          77.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_53",
        "type": "box",
        "position": [
          44.49,
          0.16,
          39.18
        ],
        "size": [
          8.3,
          0.1,
          45.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_54",
        "type": "box",
        "position": [
          35.24,
          0.16,
          39.14
        ],
        "size": [
          10.2,
          0.1,
          8.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_55",
        "type": "box",
        "position": [
          87.27,
          0.16,
          17.86
        ],
        "size": [
          9,
          0.1,
          13.5
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_56",
        "type": "box",
        "position": [
          65.73,
          0.16,
          20.5
        ],
        "size": [
          34.1,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_57",
        "type": "box",
        "position": [
          90.22,
          0.16,
          76.49
        ],
        "size": [
          13.5,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_58",
        "type": "box",
        "position": [
          70.12,
          0.16,
          57.64
        ],
        "size": [
          43.1,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_59",
        "type": "box",
        "position": [
          87.45,
          0.16,
          67.04
        ],
        "size": [
          8.6,
          0.1,
          10.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_60",
        "type": "box",
        "position": [
          87.98,
          0.16,
          96.59
        ],
        "size": [
          9,
          0.1,
          32.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_61",
        "type": "box",
        "position": [
          50.84,
          0.16,
          91.8
        ],
        "size": [
          8.6,
          0.1,
          37.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_62",
        "type": "box",
        "position": [
          64.14,
          0.16,
          76.81
        ],
        "size": [
          17.9,
          0.1,
          8.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_63",
        "type": "box",
        "position": [
          69.07,
          0.16,
          90.1
        ],
        "size": [
          8.3,
          0.1,
          18.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_64",
        "type": "box",
        "position": [
          78.41,
          0.15,
          95.02
        ],
        "size": [
          10.3,
          0.1,
          8.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7000",
        "type": "box",
        "position": [
          188.52,
          3,
          -66.49
        ],
        "size": [
          9.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7001",
        "type": "box",
        "position": [
          202.62,
          3.1,
          -66.49
        ],
        "size": [
          9.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7002",
        "type": "box",
        "position": [
          195.56,
          3,
          -95.89
        ],
        "size": [
          23.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7003",
        "type": "box",
        "position": [
          207.21,
          3,
          -81.19
        ],
        "size": [
          0.5,
          6,
          29.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7004",
        "type": "box",
        "position": [
          183.91,
          3,
          -81.19
        ],
        "size": [
          0.5,
          6,
          29.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7005",
        "type": "box",
        "position": [
          195.28,
          3,
          -26.88
        ],
        "size": [
          8.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7006",
        "type": "box",
        "position": [
          199.63,
          3,
          -46.68
        ],
        "size": [
          0.5,
          6,
          39.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7007",
        "type": "box",
        "position": [
          190.93,
          3,
          -51.025000000000006
        ],
        "size": [
          0.5,
          6,
          30.910000000000004
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7008",
        "type": "box",
        "position": [
          176.17,
          3,
          -26.270000000000003
        ],
        "size": [
          29.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7009",
        "type": "box",
        "position": [
          176.17,
          3,
          -35.57
        ],
        "size": [
          29.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7010",
        "type": "box",
        "position": [
          129.89,
          3,
          -8.65
        ],
        "size": [
          15.8,
          6,
          0.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7011",
        "type": "box",
        "position": [
          151.54,
          3,
          -8.65
        ],
        "size": [
          18.4,
          6,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7012",
        "type": "box",
        "position": [
          141.24,
          3,
          -50.05
        ],
        "size": [
          40.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7013",
        "type": "box",
        "position": [
          161.39000000000001,
          3,
          -42.81
        ],
        "size": [
          0.5,
          6,
          14.479999999999997
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7014",
        "type": "box",
        "position": [
          161.39000000000001,
          3,
          -17.46
        ],
        "size": [
          0.5,
          6,
          17.62
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7015",
        "type": "box",
        "position": [
          121.09,
          3,
          -41
        ],
        "size": [
          1,
          6,
          16
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7016",
        "type": "box",
        "position": [
          121.09,
          3,
          -19.06
        ],
        "size": [
          1,
          6,
          19
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7017",
        "type": "box",
        "position": [
          147.94,
          3,
          51.35
        ],
        "size": [
          40.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7018",
        "type": "box",
        "position": [
          133.33,
          3,
          10.35
        ],
        "size": [
          9,
          6,
          2.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7019",
        "type": "box",
        "position": [
          154.69,
          3,
          10.35
        ],
        "size": [
          24.810000000000002,
          6,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7020",
        "type": "box",
        "position": [
          168.09,
          3,
          23.13
        ],
        "size": [
          1.6,
          6,
          24.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7021",
        "type": "box",
        "position": [
          168.09,
          3,
          45.22
        ],
        "size": [
          1.6,
          6,
          10.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7022",
        "type": "box",
        "position": [
          127.78999999999999,
          3,
          30.85
        ],
        "size": [
          0.5,
          6,
          41
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7023",
        "type": "box",
        "position": [
          145.28,
          3,
          -6.035
        ],
        "size": [
          0.5,
          6,
          5.29
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7024",
        "type": "box",
        "position": [
          145.28,
          3,
          7.5649999999999995
        ],
        "size": [
          0.5,
          6,
          5.510000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7025",
        "type": "box",
        "position": [
          135.28,
          3,
          -6.035
        ],
        "size": [
          0.5,
          6,
          5.29
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7026",
        "type": "box",
        "position": [
          135.28,
          3,
          7.5649999999999995
        ],
        "size": [
          0.5,
          6,
          5.510000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7027",
        "type": "box",
        "position": [
          120.78,
          3,
          4.81
        ],
        "size": [
          29.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7028",
        "type": "box",
        "position": [
          120.78,
          3,
          -3.3899999999999997
        ],
        "size": [
          29.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7029",
        "type": "box",
        "position": [
          162.08,
          3,
          4.81
        ],
        "size": [
          33.60000000000002,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7030",
        "type": "box",
        "position": [
          166.43,
          3,
          -3.3899999999999997
        ],
        "size": [
          42.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7031",
        "type": "box",
        "position": [
          187.58,
          3,
          0.71
        ],
        "size": [
          0.5,
          6,
          8.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7032",
        "type": "box",
        "position": [
          188.125,
          3,
          23.7
        ],
        "size": [
          17.569999999999993,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7033",
        "type": "box",
        "position": [
          215.525,
          3,
          23.7
        ],
        "size": [
          18.629999999999995,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7034",
        "type": "box",
        "position": [
          202.275,
          3,
          15.099999999999998
        ],
        "size": [
          27.99000000000001,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7035",
        "type": "box",
        "position": [
          224.84,
          3,
          19.4
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7036",
        "type": "box",
        "position": [
          179.34,
          3,
          19.4
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7037",
        "type": "box",
        "position": [
          188.28,
          3,
          10.01
        ],
        "size": [
          0.5,
          6,
          10.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7038",
        "type": "box",
        "position": [
          178.88000000000002,
          3,
          10.01
        ],
        "size": [
          0.5,
          6,
          10.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7039",
        "type": "box",
        "position": [
          220.77,
          3,
          -3.2799999999999994
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7040",
        "type": "box",
        "position": [
          225.27,
          3,
          10.215
        ],
        "size": [
          0.5,
          6,
          9.809999999999999
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7041",
        "type": "box",
        "position": [
          216.27,
          3,
          5.92
        ],
        "size": [
          0.5,
          6,
          18.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7042",
        "type": "box",
        "position": [
          229.91000000000003,
          3,
          5.31
        ],
        "size": [
          9.280000000000001,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7043",
        "type": "box",
        "position": [
          234.22,
          3,
          -3.29
        ],
        "size": [
          17.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7044",
        "type": "box",
        "position": [
          243.17,
          3,
          1.01
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7045",
        "type": "box",
        "position": [
          182.49,
          3,
          42.099999999999994
        ],
        "size": [
          28.8,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7046",
        "type": "box",
        "position": [
          182.49,
          3,
          33.5
        ],
        "size": [
          28.8,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7047",
        "type": "box",
        "position": [
          206.21,
          3,
          37.83
        ],
        "size": [
          0.5,
          6,
          28.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7048",
        "type": "box",
        "position": [
          196.91,
          3,
          28.59
        ],
        "size": [
          0.5,
          6,
          9.82
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7049",
        "type": "box",
        "position": [
          196.91,
          3,
          47.03999999999999
        ],
        "size": [
          0.5,
          6,
          9.880000000000003
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7050",
        "type": "box",
        "position": [
          197.59,
          3,
          60.99
        ],
        "size": [
          36.579999999999984,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7051",
        "type": "box",
        "position": [
          183.95499999999998,
          3,
          51.99
        ],
        "size": [
          25.909999999999997,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7052",
        "type": "box",
        "position": [
          215.40500000000003,
          3,
          51.99
        ],
        "size": [
          18.390000000000015,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7053",
        "type": "box",
        "position": [
          224.60000000000002,
          3,
          56.49
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7054",
        "type": "box",
        "position": [
          171,
          3,
          56.49
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7055",
        "type": "box",
        "position": [
          239.05,
          3,
          78.91
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7056",
        "type": "box",
        "position": [
          243.55,
          3,
          42.11
        ],
        "size": [
          0.5,
          6,
          73.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7057",
        "type": "box",
        "position": [
          234.55,
          3,
          38.09
        ],
        "size": [
          0.5,
          6,
          65.56
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7058",
        "type": "box",
        "position": [
          220.49,
          3,
          79.87
        ],
        "size": [
          28.22,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7059",
        "type": "box",
        "position": [
          206.99,
          3,
          70.87
        ],
        "size": [
          17.78,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7060",
        "type": "box",
        "position": [
          229.99,
          3,
          70.87
        ],
        "size": [
          9.219999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7061",
        "type": "box",
        "position": [
          198.1,
          3,
          75.37
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7062",
        "type": "box",
        "position": [
          225.38,
          3,
          65.92
        ],
        "size": [
          0.5,
          6,
          9.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7063",
        "type": "box",
        "position": [
          215.88,
          3,
          65.92
        ],
        "size": [
          0.5,
          6,
          9.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7064",
        "type": "box",
        "position": [
          206.38,
          3,
          84.35
        ],
        "size": [
          0.5,
          6,
          9.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7065",
        "type": "box",
        "position": [
          197.38,
          3,
          84.35
        ],
        "size": [
          0.5,
          6,
          9.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7066",
        "type": "box",
        "position": [
          179.48,
          3,
          97.66
        ],
        "size": [
          53.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7067",
        "type": "box",
        "position": [
          179.245,
          3,
          88.96000000000001
        ],
        "size": [
          36.26999999999998,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7068",
        "type": "box",
        "position": [
          206.13,
          3,
          93.31
        ],
        "size": [
          0.5,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7069",
        "type": "box",
        "position": [
          152.82999999999998,
          3,
          93.31
        ],
        "size": [
          0.5,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7070",
        "type": "box",
        "position": [
          156.61,
          3,
          71.25
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7071",
        "type": "box",
        "position": [
          161.11,
          3,
          84.225
        ],
        "size": [
          0.5,
          6,
          9.449999999999989
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7072",
        "type": "box",
        "position": [
          152.11,
          3,
          80.1
        ],
        "size": [
          0.5,
          6,
          17.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7073",
        "type": "box",
        "position": [
          170.2,
          3,
          79.5
        ],
        "size": [
          18.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7074",
        "type": "box",
        "position": [
          165.7,
          3,
          70.5
        ],
        "size": [
          9.200000000000017,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7075",
        "type": "box",
        "position": [
          179.29999999999998,
          3,
          75
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7076",
        "type": "box",
        "position": [
          179.3,
          3,
          66.01
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7077",
        "type": "box",
        "position": [
          170.3,
          3,
          66.01
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7078",
        "type": "box",
        "position": [
          75.41,
          3,
          10.66
        ],
        "size": [
          20,
          6,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7079",
        "type": "box",
        "position": [
          97.72,
          3,
          10.86
        ],
        "size": [
          16,
          6,
          1.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7080",
        "type": "box",
        "position": [
          71.3,
          3,
          -13.54
        ],
        "size": [
          27,
          6,
          1.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7081",
        "type": "box",
        "position": [
          97.04,
          3,
          -13.24
        ],
        "size": [
          15.3,
          6,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7082",
        "type": "box",
        "position": [
          106.26,
          3,
          -7.66
        ],
        "size": [
          1.4,
          6,
          12.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7083",
        "type": "box",
        "position": [
          106.26,
          3,
          6.78
        ],
        "size": [
          1.5,
          6,
          7.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7084",
        "type": "box",
        "position": [
          64.86,
          3,
          2.9299999999999997
        ],
        "size": [
          0.5,
          6,
          16.46
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7085",
        "type": "box",
        "position": [
          106.25,
          3,
          -26.86
        ],
        "size": [
          29.639999999999986,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7086",
        "type": "box",
        "position": [
          101.97,
          3,
          -34.96
        ],
        "size": [
          38.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7087",
        "type": "box",
        "position": [
          82.87,
          3,
          -30.91
        ],
        "size": [
          0.5,
          6,
          8.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7088",
        "type": "box",
        "position": [
          91.43,
          3,
          -20.24
        ],
        "size": [
          0.5,
          6,
          13.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7089",
        "type": "box",
        "position": [
          82.93,
          3,
          -20.24
        ],
        "size": [
          0.5,
          6,
          13.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7090",
        "type": "box",
        "position": [
          60.73,
          3,
          -5.300000000000001
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7091",
        "type": "box",
        "position": [
          60.73,
          3,
          -13.5
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7092",
        "type": "box",
        "position": [
          10.17,
          7.7,
          -5.22
        ],
        "size": [
          23.27,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7093",
        "type": "box",
        "position": [
          43.37,
          7.7,
          -5.22
        ],
        "size": [
          26.330000000000002,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7094",
        "type": "box",
        "position": [
          27.53,
          7.7,
          -54.92
        ],
        "size": [
          58,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7095",
        "type": "box",
        "position": [
          56.53,
          7.7,
          -34.21
        ],
        "size": [
          0.5,
          15.2,
          41.42
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7096",
        "type": "box",
        "position": [
          -1.47,
          7.7,
          -30.07
        ],
        "size": [
          0.5,
          15.2,
          49.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7097",
        "type": "box",
        "position": [
          108.84,
          3,
          88.35000000000001
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7098",
        "type": "box",
        "position": [
          108.84,
          3,
          63.550000000000004
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7099",
        "type": "box",
        "position": [
          120.79,
          3,
          75.95
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7100",
        "type": "box",
        "position": [
          96.89,
          3,
          69.42
        ],
        "size": [
          1.6,
          6,
          9.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7101",
        "type": "box",
        "position": [
          96.89,
          3,
          83.02
        ],
        "size": [
          1.6,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7102",
        "type": "box",
        "position": [
          33.730000000000004,
          3,
          135.53
        ],
        "size": [
          1.1199999999999974,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7103",
        "type": "box",
        "position": [
          49.78,
          3,
          135.53
        ],
        "size": [
          14.579999999999991,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7104",
        "type": "box",
        "position": [
          39.855000000000004,
          3,
          110.72999999999999
        ],
        "size": [
          13.370000000000005,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7105",
        "type": "box",
        "position": [
          56.105,
          3,
          110.72999999999999
        ],
        "size": [
          1.9299999999999926,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7106",
        "type": "box",
        "position": [
          57.06999999999999,
          3,
          111.69
        ],
        "size": [
          0.5,
          6,
          1.9200000000000017
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7107",
        "type": "box",
        "position": [
          57.06999999999999,
          3,
          128.24
        ],
        "size": [
          0.5,
          6,
          14.579999999999998
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7108",
        "type": "box",
        "position": [
          33.17,
          3,
          123.13
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7109",
        "type": "box",
        "position": [
          125.69,
          3,
          137.46
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7110",
        "type": "box",
        "position": [
          125.69,
          3,
          112.66
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7111",
        "type": "box",
        "position": [
          137.64,
          3,
          125.06
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7112",
        "type": "box",
        "position": [
          113.74,
          3,
          129.18
        ],
        "size": [
          0.5,
          6,
          16.560000000000002
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7113",
        "type": "box",
        "position": [
          85.39,
          3,
          137.4
        ],
        "size": [
          40.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7114",
        "type": "box",
        "position": [
          74.31,
          3,
          112.6
        ],
        "size": [
          18.340000000000003,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7115",
        "type": "box",
        "position": [
          99.06,
          3,
          112.6
        ],
        "size": [
          13.159999999999997,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7116",
        "type": "box",
        "position": [
          105.64,
          3,
          129.15
        ],
        "size": [
          0.5,
          6,
          16.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7117",
        "type": "box",
        "position": [
          65.14,
          3,
          129.175
        ],
        "size": [
          0.5,
          6,
          16.450000000000003
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7118",
        "type": "box",
        "position": [
          109.64,
          3,
          120.9
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7119",
        "type": "box",
        "position": [
          109.64,
          3,
          112.6
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7120",
        "type": "box",
        "position": [
          61.1,
          3,
          120.95
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7121",
        "type": "box",
        "position": [
          61.1,
          3,
          112.64999999999999
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7122",
        "type": "box",
        "position": [
          92.8,
          3,
          174.78
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7123",
        "type": "box",
        "position": [
          92.8,
          3,
          149.88000000000002
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7124",
        "type": "box",
        "position": [
          113,
          3,
          162.33
        ],
        "size": [
          0.5,
          6,
          24.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7125",
        "type": "box",
        "position": [
          72.6,
          3,
          158.95
        ],
        "size": [
          1.6,
          6,
          17
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7126",
        "type": "box",
        "position": [
          72.6,
          3,
          174.2
        ],
        "size": [
          0.5,
          6,
          1.1599999999999966
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7127",
        "type": "box",
        "position": [
          0.51,
          3,
          188.92
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7128",
        "type": "box",
        "position": [
          0.51,
          3,
          164.62
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7129",
        "type": "box",
        "position": [
          20.71,
          3,
          176.22
        ],
        "size": [
          1.6,
          6,
          9.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7130",
        "type": "box",
        "position": [
          20.71,
          3,
          184.47
        ],
        "size": [
          0.5,
          6,
          8.099999999999994
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7131",
        "type": "box",
        "position": [
          -19.39,
          3,
          176.17
        ],
        "size": [
          0.5,
          6,
          24.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7132",
        "type": "box",
        "position": [
          46.63,
          3,
          173.62
        ],
        "size": [
          51.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7133",
        "type": "box",
        "position": [
          27.485,
          3,
          165.42000000000002
        ],
        "size": [
          13.609999999999996,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7134",
        "type": "box",
        "position": [
          57.535,
          3,
          165.42000000000002
        ],
        "size": [
          30.089999999999996,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7135",
        "type": "box",
        "position": [
          42.49,
          3,
          150.49
        ],
        "size": [
          0.5,
          6,
          29.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7136",
        "type": "box",
        "position": [
          34.29,
          3,
          150.49
        ],
        "size": [
          0.5,
          6,
          29.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7137",
        "type": "box",
        "position": [
          26,
          3,
          72.13
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7138",
        "type": "box",
        "position": [
          30.2,
          3,
          14.559999999999999
        ],
        "size": [
          0.5,
          6,
          40.26
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7139",
        "type": "box",
        "position": [
          30.2,
          3,
          57.86
        ],
        "size": [
          0.5,
          6,
          28.539999999999992
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7140",
        "type": "box",
        "position": [
          21.8,
          3,
          33.28
        ],
        "size": [
          0.5,
          6,
          77.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7141",
        "type": "box",
        "position": [
          44.49,
          3,
          61.879999999999995
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7142",
        "type": "box",
        "position": [
          44.49,
          3,
          16.48
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7143",
        "type": "box",
        "position": [
          48.64,
          3,
          39.07
        ],
        "size": [
          0.5,
          6,
          29.14
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7144",
        "type": "box",
        "position": [
          40.34,
          3,
          25.585
        ],
        "size": [
          0.5,
          6,
          18.209999999999997
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7145",
        "type": "box",
        "position": [
          40.34,
          3,
          52.735
        ],
        "size": [
          0.5,
          6,
          18.289999999999992
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7146",
        "type": "box",
        "position": [
          35.24,
          3,
          43.59
        ],
        "size": [
          10.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7147",
        "type": "box",
        "position": [
          35.24,
          3,
          34.69
        ],
        "size": [
          10.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7148",
        "type": "box",
        "position": [
          87.27,
          3,
          24.61
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7149",
        "type": "box",
        "position": [
          91.77,
          3,
          17.86
        ],
        "size": [
          0.5,
          6,
          13.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7150",
        "type": "box",
        "position": [
          82.77,
          3,
          13.805
        ],
        "size": [
          0.5,
          6,
          5.390000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7151",
        "type": "box",
        "position": [
          65.73,
          3,
          24.5
        ],
        "size": [
          34.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7152",
        "type": "box",
        "position": [
          65.73,
          3,
          16.5
        ],
        "size": [
          34.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7153",
        "type": "box",
        "position": [
          94.725,
          3,
          80.49
        ],
        "size": [
          4.489999999999995,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7154",
        "type": "box",
        "position": [
          94.36,
          3,
          72.49
        ],
        "size": [
          5.219999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7155",
        "type": "box",
        "position": [
          83.47,
          3,
          76.49
        ],
        "size": [
          0.5,
          6,
          8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7156",
        "type": "box",
        "position": [
          65.86000000000001,
          3,
          61.64
        ],
        "size": [
          34.58,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7157",
        "type": "box",
        "position": [
          70.12,
          3,
          53.64
        ],
        "size": [
          43.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7158",
        "type": "box",
        "position": [
          91.67,
          3,
          57.64
        ],
        "size": [
          0.5,
          6,
          8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7159",
        "type": "box",
        "position": [
          91.75,
          3,
          67.04
        ],
        "size": [
          0.5,
          6,
          10.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7160",
        "type": "box",
        "position": [
          83.15,
          3,
          67.04
        ],
        "size": [
          0.5,
          6,
          10.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7161",
        "type": "box",
        "position": [
          92.48,
          3,
          96.59
        ],
        "size": [
          0.5,
          6,
          32.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7162",
        "type": "box",
        "position": [
          83.48,
          3,
          85.555
        ],
        "size": [
          0.5,
          6,
          10.129999999999981
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7163",
        "type": "box",
        "position": [
          83.48,
          3,
          106.055
        ],
        "size": [
          0.5,
          6,
          13.269999999999996
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7164",
        "type": "box",
        "position": [
          50.84,
          3,
          72.9
        ],
        "size": [
          8.6,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7165",
        "type": "box",
        "position": [
          55.14,
          3,
          95.85499999999999
        ],
        "size": [
          0.5,
          6,
          29.689999999999984
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7166",
        "type": "box",
        "position": [
          46.540000000000006,
          3,
          91.8
        ],
        "size": [
          0.5,
          6,
          37.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7167",
        "type": "box",
        "position": [
          60.05499999999999,
          3,
          81.01
        ],
        "size": [
          9.72999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7168",
        "type": "box",
        "position": [
          64.14,
          3,
          72.61
        ],
        "size": [
          17.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7169",
        "type": "box",
        "position": [
          73.09,
          3,
          76.81
        ],
        "size": [
          0.5,
          6,
          8.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7170",
        "type": "box",
        "position": [
          69.07,
          3,
          99.19999999999999
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7171",
        "type": "box",
        "position": [
          73.22,
          3,
          85.81
        ],
        "size": [
          0.5,
          6,
          9.61999999999999
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7172",
        "type": "box",
        "position": [
          64.91999999999999,
          3,
          90.1
        ],
        "size": [
          0.5,
          6,
          18.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7173",
        "type": "box",
        "position": [
          78.41,
          3,
          99.42
        ],
        "size": [
          10.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7174",
        "type": "box",
        "position": [
          78.41,
          3,
          90.61999999999999
        ],
        "size": [
          10.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          195.52,
          6.76,
          -65.87
        ],
        "size": [
          4,
          2,
          2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          161.53,
          6.98,
          -31.09
        ],
        "size": [
          2,
          2,
          8.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          161.33,
          3.71,
          -34.08
        ],
        "size": [
          1.5,
          6,
          2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          161.43,
          3.64,
          -27.73
        ],
        "size": [
          1.4,
          6,
          2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          121,
          6.63,
          -30.9
        ],
        "size": [
          1.1,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          140.3,
          7.1,
          -8.58
        ],
        "size": [
          4,
          2,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          106.22,
          7.03,
          0.83
        ],
        "size": [
          1.2,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          87.37,
          6.73,
          -13.37
        ],
        "size": [
          4.2,
          2,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          87.6,
          7.01,
          10.85
        ],
        "size": [
          4,
          2,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_13",
        "type": "box",
        "position": [
          140.05,
          6.89,
          10.35
        ],
        "size": [
          4.2,
          2,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          168.14,
          6.97,
          37.64
        ],
        "size": [
          1.6,
          2,
          4.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          96.91,
          6.82,
          76.51
        ],
        "size": [
          1.6,
          2,
          4.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          72.72,
          3.12,
          172.79
        ],
        "size": [
          1.6,
          6,
          1.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          72.72,
          7,
          169.59
        ],
        "size": [
          1.6,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          20.48,
          3.23,
          166.4
        ],
        "size": [
          1.6,
          6,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          20.68,
          7.06,
          169.3
        ],
        "size": [
          1.6,
          2,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          134.35,
          3.77,
          23.64
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          134.32,
          2.96,
          33.17
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          134.39,
          3.56,
          42.3
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          140.91,
          3.64,
          25.23
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          140.93,
          3.66,
          34.78
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          140.88,
          3.99,
          43.97
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          27.4,
          4.33,
          -47.91
        ],
        "size": [
          56.7,
          0.1,
          12.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          27.71,
          2.12,
          -41.79
        ],
        "size": [
          28.7,
          4.5,
          0.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          6.68,
          2.17,
          -39.44
        ],
        "size": [
          11.5,
          0.1,
          6.2
        ],
        "rotation": [
          44,
          0,
          0
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          48.84,
          2.27,
          -39.74
        ],
        "size": [
          11.6,
          0.1,
          6
        ],
        "rotation": [
          44,
          0,
          0
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          12.98,
          0.93,
          -39.72
        ],
        "size": [
          1.2,
          1.5,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          12.98,
          2.98,
          -40.98
        ],
        "size": [
          1.2,
          2.5,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          12.98,
          2.25,
          -39.72
        ],
        "size": [
          1.2,
          1.1,
          1.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          42.43,
          2.33,
          -39.89
        ],
        "size": [
          1.2,
          1.1,
          1.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          42.33,
          0.89,
          -39.76
        ],
        "size": [
          1.2,
          1.9,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          42.33,
          3,
          -41.09
        ],
        "size": [
          1.2,
          2.3,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          188.82,
          2.93,
          -92.23
        ],
        "size": [
          5.7,
          7,
          6.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          204,
          1.45,
          -82.54
        ],
        "size": [
          5.7,
          2.5,
          8.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          186.31,
          0.75,
          -74.02
        ],
        "size": [
          2.4,
          1.4,
          3.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          204.59,
          1.44,
          -87.89
        ],
        "size": [
          1.757465370328589,
          2.5572642381467574,
          1.7574413663201511
        ],
        "materialType": "wall",
        "meshName": "chair002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          204.84,
          1.44,
          -77.08
        ],
        "size": [
          2.152840001657381,
          2.5572642381467574,
          2.152830954113398
        ],
        "materialType": "wall",
        "meshName": "chair003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          124.62,
          2.36,
          -45.85
        ],
        "size": [
          4.35594794524178,
          4.466686896193157,
          4.690001612282799
        ],
        "materialType": "wall",
        "meshName": "crates_stacked",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          137.08,
          4.29,
          -49.6
        ],
        "size": [
          7.072999954223633,
          8.34000015258789,
          2.85144659878398
        ],
        "materialType": "wall",
        "meshName": "wall_shelves",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          144.78,
          4.29,
          -49.6
        ],
        "size": [
          8.34000015258789,
          8.34000015258789,
          2.85144659878398
        ],
        "materialType": "wall",
        "meshName": "wall_shelves001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          157.44,
          2.26,
          -44.43
        ],
        "size": [
          5.124869306974489,
          4.275760503148355,
          7.8348425867092
        ],
        "materialType": "wall",
        "meshName": "keg_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          157.94,
          1.97,
          -14.85
        ],
        "size": [
          4.052922466748356,
          3.690738274420097,
          4.30761308253085
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          155.39,
          1.97,
          -11.73
        ],
        "size": [
          4.052922466748356,
          3.690738274420097,
          4.30761308253085
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          124.47,
          3.01,
          -17.64
        ],
        "size": [
          4.170001070499438,
          5.7703789499025575,
          8.392271500590141
        ],
        "materialType": "wall",
        "meshName": "table_long_decorated_C",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          124.59,
          0.65,
          -11.65
        ],
        "size": [
          1.5637501528859161,
          1.042499956935643,
          1.5637740138177492
        ],
        "materialType": "wall",
        "meshName": "stool",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          164.35,
          1.17,
          21.16
        ],
        "size": [
          4.170000821948065,
          2.0849998672679035,
          8.340001146793384
        ],
        "materialType": "wall",
        "meshName": "table_long",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          162.77,
          3.57,
          46.61
        ],
        "size": [
          8.7,
          6.8990676468725525,
          6.7
        ],
        "materialType": "wall",
        "meshName": "box_stacked001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          154.06,
          1.67,
          48.99
        ],
        "size": [
          3.1848668356683163,
          3.0917049312002973,
          3.1795514938651124
        ],
        "materialType": "wall",
        "meshName": "box_small_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          131.43,
          1.69,
          13.76
        ],
        "size": [
          4.260210182779048,
          3.1274999329447724,
          4.2602102300157
        ],
        "materialType": "wall",
        "meshName": "box_large",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          118.24,
          1.67,
          66.17
        ],
        "size": [
          3.1465359855462083,
          3.0917049312002973,
          3.1519117178215623
        ],
        "materialType": "wall",
        "meshName": "box_small_decorated001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          101.78,
          3.57,
          68.04
        ],
        "size": [
          7.7,
          6.1,
          7.5
        ],
        "materialType": "wall",
        "meshName": "box_stacked002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          49.02,
          1.21,
          133.02
        ],
        "size": [
          3.349154446603606,
          2.16980228698435,
          2.614415169395528
        ],
        "materialType": "wall",
        "meshName": "chest_gold",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          36.79,
          2.79,
          114.43
        ],
        "size": [
          4.040640519874842,
          5.330205046825412,
          3.868601585774684
        ],
        "materialType": "wall",
        "meshName": "barrel_large_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          89.57,
          1.97,
          135.2
        ],
        "size": [
          3.8625783454449305,
          3.690738274420097,
          2.0943309827061967
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          81.71,
          3.01,
          134.11
        ],
        "size": [
          8.393263917184925,
          5.7703789499025575,
          4.171997504070561
        ],
        "materialType": "wall",
        "meshName": "table_long_decorated_C001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          71.1,
          2.26,
          134.35
        ],
        "size": [
          7.337932731056867,
          4.275760503148355,
          4.170000076293945
        ],
        "materialType": "wall",
        "meshName": "keg_decorated001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_36",
        "type": "box",
        "position": [
          93.68,
          1.97,
          135.05
        ],
        "size": [
          3.8625783454449305,
          3.690738274420097,
          2.0943309827061967
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          120.71,
          1.21,
          134.96
        ],
        "size": [
          3.396459982979863,
          2.16980228698435,
          2.67561891825045
        ],
        "materialType": "wall",
        "meshName": "chest_gold001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          100.57,
          3.57,
          132.58
        ],
        "size": [
          7.245948341737744,
          6.8990676468725525,
          7.578448686971569
        ],
        "materialType": "wall",
        "meshName": "box_stacked003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          135.14,
          2.37,
          120.4
        ],
        "size": [
          2.1111022819883942,
          4.497112573409595,
          2.0850000381469727
        ],
        "materialType": "wall",
        "meshName": "table_small_decorated_B",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          78.94,
          1.44,
          153.65
        ],
        "size": [
          9.687037760079306,
          2.640169605041251,
          6.017541128824746
        ],
        "materialType": "wall",
        "meshName": "table_long_broken",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          107.07,
          1.44,
          153.64
        ],
        "size": [
          9.466253568379997,
          2.640169605041251,
          5.561150127080623
        ],
        "materialType": "wall",
        "meshName": "table_long_broken001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          109.13,
          1.14,
          171.19
        ],
        "size": [
          4.746952188438058,
          2.026126515893545,
          5.063198392341803
        ],
        "materialType": "wall",
        "meshName": "table_medium_broken",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          -15.77,
          1.14,
          185.58
        ],
        "size": [
          6.501108033266455,
          2.026126515893545,
          6.644120551591669
        ],
        "materialType": "wall",
        "meshName": "table_medium_broken001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          -9.03,
          1.44,
          185.92
        ],
        "size": [
          9.570408109219692,
          2.640169605041251,
          5.771688765302258
        ],
        "materialType": "wall",
        "meshName": "table_long_broken002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          -14.81,
          3.77,
          168.25
        ],
        "size": [
          8.339277862299657,
          7.297500146141733,
          6.255000362992291
        ],
        "materialType": "wall",
        "meshName": "rubble_half001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          8.01,
          0.75,
          186.52
        ],
        "size": [
          3.336000110745431,
          1.2510001968741449,
          2.5974991752096344
        ],
        "materialType": "wall",
        "meshName": "chest001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          18.03,
          1.81,
          186.62
        ],
        "size": [
          2.16635034337466,
          3.3804100273628137,
          2.5254335686679497
        ],
        "materialType": "wall",
        "meshName": "table_small_decorated_A",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          90.08,
          3.57,
          153.81
        ],
        "size": [
          6.6,
          6.2,
          7.9
        ],
        "materialType": "wall",
        "meshName": "box_stacked004",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          92.78,
          4.33,
          10.49
        ],
        "size": [
          4.6537252908040045,
          8.34000015258789,
          3.5656915300789365
        ],
        "materialType": "wall",
        "meshName": "pillar_decorated003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          116.06,
          3.57,
          83.54
        ],
        "size": [
          7.245948341737744,
          6.8990676468725525,
          7.578448686971569
        ],
        "materialType": "wall",
        "meshName": "box_stacked005",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          115.15,
          1.76,
          128.84
        ],
        "size": [
          1.9397143695487529,
          3.4966749854724894,
          4.655946352112522
        ],
        "materialType": "wall",
        "meshName": "sword_shield_gold",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          115.15,
          1.76,
          124.05
        ],
        "size": [
          1.9397143695487529,
          3.4966749854724894,
          4.655946352112508
        ],
        "materialType": "wall",
        "meshName": "sword_shield_gold001",
        "rotation": [
          0,
          0,
          0
        ]
      }
    ],
    "fallbackObjects": [
      {
        "type": "box",
        "position": [
          0,
          0,
          0
        ],
        "size": [
          50,
          1,
          50
        ],
        "color": 7048739
      }
    ]
  },
  {
    "id": "level3",
    "name": "level 3",
    "order": 1,
    "gltfUrl": "assets/levels/Level3/level3.gltf",
    "startPosition": [
      -4,
      6,
      0
    ],
    "lights": [
      "BasicLights"
    ],
    "ui": [
      "hud",
      {
        "type": "minimap",
        "config": {
          "zoom": 1.6
        }
      },
      {
        "type": "collectibles",
        "config": {
          "potionsStart": 2,
          "llmGptTotal": 3,
          "llmClaudeTotal": 3,
          "llmGeminiTotal": 3,
          "collectibleTypes": {
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#4caf50",
              "lowColor": "#ff9800",
              "emptyColor": "#f44336",
              "emptyIcon": "💔"
            },
            "llm_gpt": {
              "icon": "🤖",
              "name": "GPT",
              "color": "#10a37f",
              "collectedColor": "#51cf66"
            },
            "llm_claude": {
              "icon": "🤖",
              "name": "Claude",
              "color": "#d4af37",
              "collectedColor": "#51cf66"
            },
            "llm_gemini": {
              "icon": "🤖",
              "name": "Gemini",
              "color": "#8b5cf6",
              "collectedColor": "#51cf66"
            }
          }
        }
      }
    ],
    "enemies": [],
    "fallbackObjects": [
      {
        "type": "box",
        "position": [
          0,
          0,
          0
        ],
        "size": [
          20,
          1,
          20
        ],
        "color": 7048739
      }
    ],

    "cinematics": {
  "onLevelStart": {
    "sequence": [
      { "type": "takeCamera" },
      { "type": "fadeOut", "ms": 300 },
      { "type": "cut", "position": [-1, 7, -3], "lookAt": "player", "fov": 55 },
      { "type": "fadeIn", "ms": 600 },
      {
        "type": "playVO",
        "vo": "vo-l3-intro",
        "fallbackMs": 23000,
        "block": true,
        "segments": [
          { "at": 0, "ms": 2100, "text": "BRANDEN: Sir Knight. Eyes up. Yes, it is me—your favorite lecturer, now a giant floating eyeball. I am keeping an eye on you." },
          { "at": 2400, "ms": 1800, "text": "PLAYER: Only you would turn into a sky-orb for office hours." },
          { "at": 4400, "ms": 3900, "text": "BRANDEN: Your project theme is “Consequence.” You have three weeks. It counts for the majority of your grade. No use of AI." },
          { "at": 8600, "ms": 2400, "text": "BRANDEN: Good luck. I will be watching." },
          { "at": 11200, "ms": 4600, "text": "PLAYER (INTERNAL MONOLOGUE): Three weeks. Consequence. Everyone else is already panicking. But not me." },
          { "at": 16200, "ms": 4300, "text": "PLAYER (INTERNAL MONOLOGUE): I have the ultimate advantage—ChatGPT, Claude, Gemini. I will be careful." },
          { "at": 20700, "ms": 3000, "text": "BRANDEN: Time to collect those AIs and head to MSL." }
        ],
        "concurrent": [
          { "type": "orbit", "center": "player", "radius": 7.5, "startDeg": 20, "endDeg": 55, "height": 4.8, "duration": 12000 },
          { "type": "wait", "ms": 6200 },
          { "type": "orbit", "center": [72, 9, -100], "radius": 2, "startDeg": 0, "endDeg": 60, "height": 4, "duration": 6000 }
        ]
      },
      { "type": "fadeOut", "ms": 250 },
      { "type": "releaseCamera" },
      { "type": "fadeIn", "ms": 250 }
    ]
  },

  // Small rumble beat before teleport to level1_glitched
  "l3_p2_glitch": {
    "sequence": [
      { "type": "takeCamera" },
      { "type": "rumble", "sfx": "rumbling", "seconds": 1.2, "magnitude": 0.18, "volume": 0.8 },
      { "type": "caption", "text": "System link engaged… hold steady.", "ms": 900 },
      { "type": "fadeOut", "ms": 220 },
      { "type": "releaseCamera" }
    ]
  },

  // Finale already triggered by game.js when level3 completes
  "l3_p4_graduation": {
    "sequence": [
      { "type": "takeCamera" },
      { "type": "fadeOut", "ms": 200 },
      { "type": "cut", "position": [32, 6, -24], "lookAt": [30, 2, -25], "fov": 60 },
      { "type": "fadeIn", "ms": 300 },
      { "type": "caption", "text": "YOUR WORK IS YOUR SIGNATURE. MAKE IT LEGENDARY.", "ms": 2600 },
      { "type": "orbit", "center": "player", "radius": 6, "startDeg": 10, "endDeg": 70, "height": 3.2, "duration": 2500 },
      { "type": "fadeOut", "ms": 250 },
      { "type": "releaseCamera" },
      { "type": "fadeIn", "ms": 250 }
    ]
  }
},

    "computerLocation": {
      "position": [
        72,
        9,
        -100
      ],
      "radius": 20,
      "requiredLLMs": [
        "llm_gpt",
        "llm_claude",
        "llm_gemini"
      ]
    },
    "colliders": [
      {
        "id": "collider_1",
        "type": "box",
        "position": [
          -66.09307861328125,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_2",
        "type": "box",
        "position": [
          -4.146604537963867,
          0.37647994607686996,
          -46.284488677978516
        ],
        "size": [
          8.190000305175781,
          0.4099999314546585,
          19.32999969482422
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          -4.146605491638184,
          -3.006011486053467,
          -93.20339965820312
        ],
        "size": [
          72.15000129699708,
          7.174983749389648,
          74.45000244140626
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_4",
        "type": "box",
        "position": [
          -4.146605491638184,
          0.37647994607686996,
          -93.20339965820312
        ],
        "size": [
          72.15000129699708,
          0.4099999314546585,
          74.45000244140626
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_5",
        "type": "box",
        "position": [
          -10.747124671936035,
          0.3240940570831299,
          -100.76078033447266
        ],
        "size": [
          6.2385594940185545,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_6",
        "type": "box",
        "position": [
          -4.713195204734802,
          0.3240940570831299,
          -100.76078033447266
        ],
        "size": [
          6.238558778762817,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_7",
        "type": "box",
        "position": [
          -7.514929294586182,
          0.3240940570831299,
          -106.02754974365234
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_8",
        "type": "box",
        "position": [
          -13.408448696136475,
          0.3240940570831299,
          -95.70004272460938
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_9",
        "type": "box",
        "position": [
          -13.408448696136475,
          0.3240940570831299,
          -106.49646759033203
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          -16.473021984100342,
          0.3240940570831299,
          -100.8111572265625
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          -1.617836356163025,
          0.3240940570831299,
          -84.77955627441406
        ],
        "size": [
          6.238558778762817,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          4.275683760643005,
          0.3240940570831299,
          -84.77955627441406
        ],
        "size": [
          6.238558778762817,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_13",
        "type": "box",
        "position": [
          -13.885802745819092,
          0.3240940570831299,
          -85.19320678710938
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_14",
        "type": "box",
        "position": [
          -7.851874828338623,
          0.3240940570831299,
          -85.19320678710938
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          -10.653608322143555,
          0.3240940570831299,
          -90.45997619628906
        ],
        "size": [
          6.2385594940185545,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          -10.653608322143555,
          0.3240940570831299,
          -80.13247680664062
        ],
        "size": [
          6.2385594940185545,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          -16.547128200531006,
          0.3240940570831299,
          -80.13247680664062
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          -16.547128200531006,
          0.3240940570831299,
          -90.92889404296875
        ],
        "size": [
          6.238558540344238,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          -19.61170196533203,
          0.3240940570831299,
          -85.24359130859375
        ],
        "size": [
          6.238557586669922,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          -2.188052535057068,
          0.3240940570831299,
          -105.55937957763672
        ],
        "size": [
          6.238558778762817,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          0.8765206336975098,
          0.3240940570831299,
          -111.24468231201172
        ],
        "size": [
          6.238559017181396,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          6.770041584968567,
          0.3240940570831299,
          -110.77576446533203
        ],
        "size": [
          6.238559255599975,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          9.57177448272705,
          0.3240940570831299,
          -105.50899505615234
        ],
        "size": [
          6.2385594940185545,
          3.124279508590698,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          -5.587122082710266,
          1.988413393497467,
          -92.71240234375
        ],
        "size": [
          6.238559255599975,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          -2.354927182197571,
          1.988413393497467,
          -97.97917175292969
        ],
        "size": [
          6.238559255599975,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          -2.354927182197571,
          1.988413393497467,
          -87.65167236328125
        ],
        "size": [
          6.238559255599975,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          -8.24844741821289,
          1.988413393497467,
          -87.65167236328125
        ],
        "size": [
          6.2385594940185545,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          -8.24844741821289,
          1.988413393497467,
          -98.44808959960938
        ],
        "size": [
          6.2385594940185545,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          -11.313020706176758,
          1.988413393497467,
          -92.76278686523438
        ],
        "size": [
          6.2385594940185545,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          8.195573806762695,
          1.988413393497467,
          -97.97917175292969
        ],
        "size": [
          6.2385594940185545,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          10.997306823730469,
          1.988413393497467,
          -92.71240234375
        ],
        "size": [
          6.2385594940185545,
          3.1242796277999876,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          4.9633790254592896,
          4.887171506881714,
          -92.71240234375
        ],
        "size": [
          6.238559255599975,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          10.997306823730469,
          4.887171506881714,
          -92.71240234375
        ],
        "size": [
          6.2385594940185545,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          8.195573806762695,
          4.887171506881714,
          -97.97917175292969
        ],
        "size": [
          6.2385594940185545,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          8.195573806762695,
          4.887171506881714,
          -87.65167236328125
        ],
        "size": [
          6.2385594940185545,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_36",
        "type": "box",
        "position": [
          2.3020535707473755,
          4.887171506881714,
          -87.65167236328125
        ],
        "size": [
          6.238559255599975,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_37",
        "type": "box",
        "position": [
          2.3020535707473755,
          4.887171506881714,
          -98.44808959960938
        ],
        "size": [
          6.238559255599975,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_38",
        "type": "box",
        "position": [
          -0.7625198364257812,
          4.887171506881714,
          -92.76278686523438
        ],
        "size": [
          6.238559017181396,
          3.124279270172119,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_39",
        "type": "box",
        "position": [
          -0.7625198364257812,
          2.8651480674743652,
          -104.92472076416016
        ],
        "size": [
          6.238559017181396,
          3.124279747009277,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_40",
        "type": "box",
        "position": [
          2.3020535707473755,
          2.8651480674743652,
          -110.61002349853516
        ],
        "size": [
          6.238559255599975,
          3.124279747009277,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_41",
        "type": "box",
        "position": [
          8.195573806762695,
          2.8651480674743652,
          -99.81360626220703
        ],
        "size": [
          6.2385594940185545,
          3.124279747009277,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_42",
        "type": "box",
        "position": [
          4.9633790254592896,
          2.8651480674743652,
          -104.87433624267578
        ],
        "size": [
          6.238559255599975,
          3.124279747009277,
          7.202123413085937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_43",
        "type": "box",
        "position": [
          -0.4834919571876526,
          11.83132791519165,
          -93.50671005249023
        ],
        "size": [
          3.7451597547531126,
          10.78403163909912,
          2.879087219238281
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_44",
        "type": "box",
        "position": [
          10.713878631591797,
          9.081506729125977,
          -92.54607772827148
        ],
        "size": [
          2.017350921630859,
          5.284394989013672,
          2.0143563842773435
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_45",
        "type": "box",
        "position": [
          2.193972587585449,
          7.944567680358887,
          -95.69882202148438
        ],
        "size": [
          1.5377743339538574,
          3.0105130767822263,
          1.5145623779296875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_46",
        "type": "box",
        "position": [
          9.725643157958984,
          10.488131523132324,
          -86.96797180175781
        ],
        "size": [
          4.7496068572998045,
          8.097648391723633,
          4.04436279296875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_47",
        "type": "box",
        "position": [
          -1.433174192905426,
          7.016848564147949,
          -88.5144271850586
        ],
        "size": [
          2.584008822441101,
          6.952590713500976,
          2.2802484130859373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_48",
        "type": "box",
        "position": [
          5.419551610946655,
          9.809300422668457,
          -101.8972282409668
        ],
        "size": [
          3.745159397125244,
          10.784030685424804,
          2.879087219238281
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_49",
        "type": "box",
        "position": [
          -3.4102213382720947,
          6.412143230438232,
          -89.80375289916992
        ],
        "size": [
          3.6992981529235838,
          3.658297309875488,
          3.1404244995117185
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_50",
        "type": "box",
        "position": [
          12.27762746810913,
          2.3344669342041016,
          -98.3631362915039
        ],
        "size": [
          3.9152114486694334,
          3.5259721374511717,
          2.72124267578125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_51",
        "type": "box",
        "position": [
          6.919989585876465,
          5.744657516479492,
          -103.90366744995117
        ],
        "size": [
          3.3044469451904295,
          3.4094436264038084,
          2.6320016479492185
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_52",
        "type": "box",
        "position": [
          44.65730285644531,
          -2.942340850830078,
          -93.20339965820312
        ],
        "size": [
          72.14999938964844,
          7.0476415252685545,
          74.45000244140626
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_53",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351887881755829,
          -80.44161605834961
        ],
        "size": [
          3.4815194702148435,
          1.925548861026764,
          2.0710885620117185
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_54",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351904571056366,
          -90.38328170776367
        ],
        "size": [
          3.4815194702148435,
          1.925548861026764,
          2.0710885620117185
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_55",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351890861988068,
          -82.48786163330078
        ],
        "size": [
          3.4815194702148435,
          1.9255487418174744,
          2.07109619140625
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_56",
        "type": "box",
        "position": [
          72.89146041870117,
          1.635189175605774,
          -82.90581130981445
        ],
        "size": [
          2.0710885620117185,
          1.925550947189331,
          14.937528381347656
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_57",
        "type": "box",
        "position": [
          72.47,
          3.26,
          -83.24
        ],
        "size": [
          3.7,
          6.145838970541954,
          17.40250946044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_58",
        "type": "box",
        "position": [
          71.41300964355469,
          4.655417442321777,
          -127.30907440185547
        ],
        "size": [
          6.487859497070312,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_59",
        "type": "box",
        "position": [
          73.07,
          3.26,
          -117.58
        ],
        "size": [
          3.7,
          6.145838970541954,
          17.40250946044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_60",
        "type": "box",
        "position": [
          72.67,
          3.26,
          -100.2
        ],
        "size": [
          3.5,
          6.145836720466614,
          17.40251708984375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_61",
        "type": "box",
        "position": [
          64.60509490966797,
          4.655417442321777,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_62",
        "type": "box",
        "position": [
          56.9735107421875,
          4.655417442321777,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_63",
        "type": "box",
        "position": [
          49.1647834777832,
          4.655417442321777,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_64",
        "type": "box",
        "position": [
          46.29999923706055,
          4.655417442321777,
          -114.91680908203125
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_65",
        "type": "box",
        "position": [
          46.29999923706055,
          4.655417442321777,
          -91.29583740234375
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_66",
        "type": "box",
        "position": [
          46.29999923706055,
          4.655417442321777,
          -98.90213012695312
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_67",
        "type": "box",
        "position": [
          46.29999923706055,
          4.655417442321777,
          -75.79105377197266
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_68",
        "type": "box",
        "position": [
          46.29999923706055,
          4.655417442321777,
          -68.18476104736328
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_69",
        "type": "box",
        "position": [
          46.30038070678711,
          4.655417442321777,
          -60.11272430419922
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_70",
        "type": "box",
        "position": [
          50.836158752441406,
          4.655417442321777,
          -57.02865982055664
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_71",
        "type": "box",
        "position": [
          58.65519714355469,
          4.655417442321777,
          -57.02865982055664
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_72",
        "type": "box",
        "position": [
          72.70499420166016,
          4.655417442321777,
          -56.92972183227539
        ],
        "size": [
          5.1299951171875,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_73",
        "type": "box",
        "position": [
          66.60327911376953,
          4.655417442321777,
          -56.92165756225586
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_74",
        "type": "box",
        "position": [
          45.78788375854492,
          4.655417442321777,
          -122.74683380126953
        ],
        "size": [
          2.224454650878906,
          8.167865524291992,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_75",
        "type": "box",
        "position": [
          54.462562561035156,
          0.6514808833599091,
          -115.88456726074219
        ],
        "size": [
          17.45000244140625,
          0.16000003576278687,
          23.20999694824219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_76",
        "type": "box",
        "position": [
          54.462562561035156,
          0.6514808833599091,
          -92.7137680053711
        ],
        "size": [
          17.45000244140625,
          0.16000003576278687,
          23.20999694824219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_77",
        "type": "box",
        "position": [
          54.462562561035156,
          0.6514808833599091,
          -70.0849609375
        ],
        "size": [
          17.45000244140625,
          0.16000003576278687,
          23.20999694824219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_78",
        "type": "box",
        "position": [
          49.1647834777832,
          12.9999361038208,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_79",
        "type": "box",
        "position": [
          56.9735107421875,
          12.9999361038208,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_80",
        "type": "box",
        "position": [
          64.60509490966797,
          12.9999361038208,
          -127.30907440185547
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_81",
        "type": "box",
        "position": [
          71.5522232055664,
          12.9999361038208,
          -127.30907440185547
        ],
        "size": [
          6.810003051757812,
          8.167865524291992,
          2.0494744873046873
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_82",
        "type": "box",
        "position": [
          72.6719970703125,
          12.9999361038208,
          -56.9600830078125
        ],
        "size": [
          4.88786865234375,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_83",
        "type": "box",
        "position": [
          66.2516860961914,
          12.9999361038208,
          -56.9600830078125
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_84",
        "type": "box",
        "position": [
          58.6201057434082,
          12.9999361038208,
          -56.9600830078125
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_85",
        "type": "box",
        "position": [
          50.811378479003906,
          12.9999361038208,
          -56.9600830078125
        ],
        "size": [
          8.167867431640625,
          8.167865524291992,
          2.049466857910156
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_86",
        "type": "box",
        "position": [
          72.87,
          11.11,
          -117.58
        ],
        "size": [
          3,
          9.827339897155762,
          17.40250946044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_87",
        "type": "box",
        "position": [
          46.30038070678711,
          12.851102352142334,
          -60.11272430419922
        ],
        "size": [
          2.224454650878906,
          8.167864570617676,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_88",
        "type": "box",
        "position": [
          46.29999923706055,
          12.851102352142334,
          -68.18476104736328
        ],
        "size": [
          2.224454650878906,
          8.167864570617676,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_89",
        "type": "box",
        "position": [
          46.29999923706055,
          12.552655696868896,
          -114.91680908203125
        ],
        "size": [
          2.224454650878906,
          8.167864570617676,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_90",
        "type": "box",
        "position": [
          46.29999923706055,
          12.552655696868896,
          -122.52310180664062
        ],
        "size": [
          2.224454650878906,
          8.167864570617676,
          8.209844360351562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_91",
        "type": "box",
        "position": [
          72.97,
          11.11,
          -100.44
        ],
        "size": [
          3,
          9.82734037399292,
          17.40250946044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_92",
        "type": "box",
        "position": [
          72.97,
          11.22,
          -83.5
        ],
        "size": [
          4.2,
          9.827339897155762,
          15.8
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_93",
        "type": "box",
        "position": [
          72.87,
          11.26,
          -66.36
        ],
        "size": [
          4.5,
          9.827338943481445,
          18.2
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_94",
        "type": "box",
        "position": [
          -4.146605491638184,
          -6.121493101119995,
          -167.87081909179688
        ],
        "size": [
          72.15000129699708,
          0.41000009536743165,
          74.45000244140626
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_95",
        "type": "box",
        "position": [
          9.966483116149902,
          0.33321285247802734,
          -177.92388916015625
        ],
        "size": [
          7.323985824584961,
          12.82044578552246,
          7.323995361328125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_96",
        "type": "box",
        "position": [
          1.18,
          15.89,
          -185.4
        ],
        "size": [
          17.6,
          43.76579833984375,
          22.7
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_97",
        "type": "box",
        "position": [
          -84.00011444091797,
          -4.689949989318848,
          -93.52341079711914
        ],
        "size": [
          88.38635803222657,
          10.488708267211914,
          75.12998748779297
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_98",
        "type": "box",
        "position": [
          42.35832214355469,
          -5.95515513420105,
          -186.05609130859375
        ],
        "size": [
          21.050000915527345,
          0.5064823722839356,
          20.33000732421875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_99",
        "type": "box",
        "position": [
          73.79,
          -5.96,
          -186.06
        ],
        "size": [
          42.2,
          0.5064823722839356,
          20.33000732421875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_100",
        "type": "box",
        "position": [
          58.925350189208984,
          -1.513418197631836,
          -202.97457885742188
        ],
        "size": [
          1.426229248046875,
          8.01,
          18.417806396484377
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_101",
        "type": "box",
        "position": [
          82.23252868652344,
          -1.5199341773986816,
          -194.3062744140625
        ],
        "size": [
          15.45000244140625,
          8.01,
          1.80998779296875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_102",
        "type": "box",
        "position": [
          66.92194366455078,
          -1.513418197631836,
          -194.2969970703125
        ],
        "size": [
          16.01,
          8.01,
          1.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_103",
        "type": "box",
        "position": [
          89.0140609741211,
          -1.6869068145751953,
          -202.80429077148438
        ],
        "size": [
          2.367574462890625,
          8.01,
          17.93724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_104",
        "type": "box",
        "position": [
          70.24603080749512,
          -1.6800312995910645,
          -211.56866455078125
        ],
        "size": [
          22.570001373291017,
          8.01,
          1.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_105",
        "type": "box",
        "position": [
          73.06330871582031,
          -3.837541103363037,
          -197.06166076660156
        ],
        "size": [
          4.01,
          2.4100005722045896,
          4.585714111328125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_106",
        "type": "box",
        "position": [
          63.02628135681152,
          -5.79649543762207,
          -198.603271484375
        ],
        "size": [
          9.049997100830078,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_107",
        "type": "box",
        "position": [
          63.02628135681152,
          -5.79649543762207,
          -206.949951171875
        ],
        "size": [
          9.049997100830078,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_108",
        "type": "box",
        "position": [
          72.33221435546875,
          -5.79649543762207,
          -206.949951171875
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_109",
        "type": "box",
        "position": [
          72.33221435546875,
          -5.79649543762207,
          -198.578857421875
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_110",
        "type": "box",
        "position": [
          82.8138198852539,
          -5.79649543762207,
          -198.578857421875
        ],
        "size": [
          11.769994506835937,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_111",
        "type": "box",
        "position": [
          82.8138198852539,
          -5.79649543762207,
          -207.1155242919922
        ],
        "size": [
          11.769994506835937,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_112",
        "type": "box",
        "position": [
          78.65034103393555,
          -1.6714963912963867,
          -208.4500503540039
        ],
        "size": [
          8.020948181152344,
          8.01,
          5.833318481445312
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_113",
        "type": "box",
        "position": [
          60.48634147644043,
          -3.1714935302734375,
          -198.40015411376953
        ],
        "size": [
          3.1552980041503904,
          5.01,
          4.125615844726562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_114",
        "type": "box",
        "position": [
          69.27981567382812,
          -3.8698636293411255,
          -209.70603942871094
        ],
        "size": [
          4.01,
          3.6132521724700926,
          4.09380126953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_115",
        "type": "box",
        "position": [
          65.44599914550781,
          -3.576341152191162,
          -209.43534088134766
        ],
        "size": [
          4.02153564453125,
          4.200297126770019,
          4.536870727539062
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_116",
        "type": "box",
        "position": [
          60.77358627319336,
          -3.7472740411758423,
          -207.87240600585938
        ],
        "size": [
          4.1759774780273435,
          3.8659424877166746,
          6.119344482421875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_117",
        "type": "box",
        "position": [
          101.0167007446289,
          -3.817743420600891,
          -206.6825714111328
        ],
        "size": [
          6.01,
          3.7243990993499754,
          6.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_118",
        "type": "box",
        "position": [
          93.74247741699219,
          -5.79649543762207,
          -198.603271484375
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_119",
        "type": "box",
        "position": [
          93.74247741699219,
          -5.79649543762207,
          -206.93582153320312
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_120",
        "type": "box",
        "position": [
          102.21664428710938,
          -5.79649543762207,
          -206.93582153320312
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_121",
        "type": "box",
        "position": [
          102.21664428710938,
          -5.79649543762207,
          -198.63429260253906
        ],
        "size": [
          9.049993286132812,
          0.26,
          8.409993896484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_122",
        "type": "box",
        "position": [
          26.252357721328735,
          0.6120080053806305,
          -28.36172580718994
        ],
        "size": [
          37.437833080291746,
          0.8125094866752625,
          16.57141471862793
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_123",
        "type": "box",
        "position": [
          135.6346321105957,
          0.6120082437992096,
          -26.916135787963867
        ],
        "size": [
          37.43784881591797,
          0.8125099635124207,
          16.571405181884767
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_124",
        "type": "box",
        "position": [
          162.20928955078125,
          0.6080374419689178,
          -26.67609405517578
        ],
        "size": [
          16.093251953125,
          0.8125098443031311,
          16.04318786621094
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_125",
        "type": "box",
        "position": [
          161.9557647705078,
          0.6120082437992096,
          -53.168386459350586
        ],
        "size": [
          16.415487060546877,
          0.8125099635124207,
          37.372064361572264
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_126",
        "type": "box",
        "position": [
          100.38780975341797,
          0.6120077520608902,
          -27.426315307617188
        ],
        "size": [
          37.43782592773437,
          0.8125095164775848,
          16.571416625976564
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_127",
        "type": "box",
        "position": [
          161.18165588378906,
          0.6120082437992096,
          -126.48429870605469
        ],
        "size": [
          16.415487060546877,
          0.8125099635124207,
          37.372060546875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_128",
        "type": "box",
        "position": [
          161.18,
          -0.39,
          -155.77
        ],
        "size": [
          16.274251708984377,
          1.4,
          22.595159301757814
        ],
        "rotation": [
          -6,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_129",
        "type": "box",
        "position": [
          160.97,
          -2.6,
          -178.08
        ],
        "size": [
          16.2,
          0.4,
          23.2
        ],
        "rotation": [
          -10,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_130",
        "type": "box",
        "position": [
          160.66,
          -5.58,
          -196.41
        ],
        "size": [
          16.05998779296875,
          0.1,
          15.990636596679687
        ],
        "rotation": [
          -13,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_131",
        "type": "box",
        "position": [
          160.41383361816406,
          -6.651570081710815,
          -222.92092895507812
        ],
        "size": [
          16.415487060546877,
          0.8125097846984863,
          37.372060546875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_132",
        "type": "box",
        "position": [
          160.2193603515625,
          -6.581960201263428,
          -249.5128402709961
        ],
        "size": [
          16.05998779296875,
          0.8124997711181641,
          16.060003051757814
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_133",
        "type": "box",
        "position": [
          186.4586639404297,
          -1.0503978729248047,
          -249.79176330566406
        ],
        "size": [
          40.33815551757812,
          12.183847198486328,
          35.71236206054687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_134",
        "type": "box",
        "position": [
          186.56651306152344,
          -6.563352823257446,
          -250.04498291015625
        ],
        "size": [
          37.66719604492187,
          0.8125097846984863,
          17.12566162109375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_135",
        "type": "box",
        "position": [
          186.43,
          4.98,
          -78.01
        ],
        "size": [
          1.83183837890625,
          8.009999523162842,
          15.451009521484375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_136",
        "type": "box",
        "position": [
          194.94,
          4.82,
          -71.24
        ],
        "size": [
          17.936834106445314,
          8.01,
          2.3927667236328123
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_137",
        "type": "box",
        "position": [
          200.57,
          5.03,
          -81.61
        ],
        "size": [
          5.84477783203125,
          8.01,
          8.023076782226562
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_138",
        "type": "box",
        "position": [
          186.4,
          4.99,
          -93.32
        ],
        "size": [
          1.0386865234375,
          8.01,
          16.011007080078127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_139",
        "type": "box",
        "position": [
          203.67,
          4.92,
          -90.03
        ],
        "size": [
          1.050435791015625,
          8.009999523162842,
          22.570997009277345
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_140",
        "type": "box",
        "position": [
          195.06,
          5.09,
          -101.33
        ],
        "size": [
          18.41757751464844,
          8.01,
          1.3932855224609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_141",
        "type": "box",
        "position": [
          189.17,
          2.77,
          -87.18
        ],
        "size": [
          4.59154296875,
          2.4100005722045896,
          4.017308959960937
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_142",
        "type": "box",
        "position": [
          199.96,
          2.96,
          -99.49
        ],
        "size": [
          6.1265771484375,
          3.8659427261352537,
          4.187078247070312
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_143",
        "type": "box",
        "position": [
          201.8113021850586,
          3.4338808059692383,
          -90.98883056640625
        ],
        "size": [
          4.097570190429687,
          3.6132524108886717,
          4.017537841796875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_144",
        "type": "box",
        "position": [
          194.28,
          3.33,
          -99.77
        ],
        "size": [
          4.130086669921875,
          5.01,
          3.161008605957031
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_145",
        "type": "box",
        "position": [
          190.8,
          0.71,
          -58.03
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_146",
        "type": "box",
        "position": [
          199.1,
          0.71,
          -58.05
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_147",
        "type": "box",
        "position": [
          199.09,
          0.71,
          -66.52
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_148",
        "type": "box",
        "position": [
          190.75,
          0.71,
          -66.51
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_149",
        "type": "box",
        "position": [
          199.24,
          0.51,
          -77.45
        ],
        "size": [
          8.43218017578125,
          0.26,
          11.785833129882812
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_150",
        "type": "box",
        "position": [
          160.34458923339844,
          7.149407386779785,
          -6.519891083240509
        ],
        "size": [
          16.638143310546877,
          13.20999885559082,
          16.63814271450043
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_151",
        "type": "box",
        "position": [
          -28.275938987731934,
          0.3220776319503784,
          -24.72003173828125
        ],
        "size": [
          31.498878250122072,
          0.584899435043335,
          16.417058715820314
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_152",
        "type": "box",
        "position": [
          -44.24627494812012,
          4.058908581733704,
          -18.518760442733765
        ],
        "size": [
          0.6856553649902344,
          7.675300130844116,
          27.941427478790285
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_153",
        "type": "box",
        "position": [
          -39.981956481933594,
          3.9630932807922363,
          -1.0731772780418396
        ],
        "size": [
          9.316007385253906,
          7.866930732727051,
          0.6582890844345093
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_154",
        "type": "box",
        "position": [
          -21.745351314544678,
          12.122428894042969,
          -1.006352424621582
        ],
        "size": [
          18.143111000061037,
          7.298646697998047,
          0.4456706142425537
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_155",
        "type": "box",
        "position": [
          -28.275938987731934,
          8.19727087020874,
          -9.363187491893768
        ],
        "size": [
          31.498878250122072,
          0.5848987197875977,
          16.417059311866762
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_156",
        "type": "box",
        "position": [
          -28.269343376159668,
          8.19727087020874,
          -24.71727752685547
        ],
        "size": [
          31.498878250122072,
          0.5848987197875977,
          16.417058715820314
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_157",
        "type": "box",
        "position": [
          -44.24626159667969,
          11.934102058410645,
          -15.564459502696991
        ],
        "size": [
          0.6856668090820313,
          7.675300369262695,
          27.941429505348207
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_158",
        "type": "box",
        "position": [
          -39.52484893798828,
          11.934102058410645,
          -1.6400461792945862
        ],
        "size": [
          9.018110046386719,
          7.675300369262695,
          0.4271992540359497
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_159",
        "type": "box",
        "position": [
          -28.33,
          11.93,
          -32.78
        ],
        "size": [
          32,
          7.675300369262695,
          0.46404052734375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_160",
        "type": "box",
        "position": [
          -32.56283760070801,
          8.197269916534424,
          6.235307812690735
        ],
        "size": [
          4.896783599853515,
          0.5848968124389649,
          5.010749349594116
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_161",
        "type": "box",
        "position": [
          -32.53523254394531,
          8.197269916534424,
          1.526823490858078
        ],
        "size": [
          4.875982055664062,
          0.5848968124389649,
          5.010670492649078
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_162",
        "type": "box",
        "position": [
          -35.00304412841797,
          12.125734329223633,
          3.359298050403595
        ],
        "size": [
          0.43153167724609376,
          7.292032012939453,
          10.167897353172302
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_stair_163",
        "type": "box",
        "position": [
          -24.4,
          4.09,
          3.8
        ],
        "size": [
          14.9,
          1.1,
          9.3
        ],
        "rotation": [
          0,
          0,
          -32.00061183531603
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_164",
        "type": "box",
        "position": [
          59.65,
          6.88,
          -73.21
        ],
        "size": [
          30.1,
          0.7005980110168457,
          30.9
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_165",
        "type": "box",
        "position": [
          40.28,
          8.5,
          -91.1
        ],
        "size": [
          10.47920394897461,
          0.6609342193603516,
          42.73827911376953
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_166",
        "type": "box",
        "position": [
          40.4452018737793,
          12.283348083496094,
          -112.59230041503906
        ],
        "size": [
          10.619001159667969,
          7.866929779052734,
          1.072835693359375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_167",
        "type": "box",
        "position": [
          40.4452018737793,
          12.283348083496094,
          -70.30510711669922
        ],
        "size": [
          10.619001159667969,
          7.866929779052734,
          1.072835693359375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_168",
        "type": "box",
        "position": [
          74.58,
          0.87,
          -37.98
        ],
        "size": [
          150,
          0.11498499870300292,
          4.686280975341797
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_169",
        "type": "box",
        "position": [
          92.08,
          0.87,
          -17.52
        ],
        "size": [
          170,
          0.11498499870300292,
          4.6862828826904295
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_170",
        "type": "box",
        "position": [
          63.28121566772461,
          0.6120029240846634,
          -27.9135684967041
        ],
        "size": [
          37.437833557128904,
          0.8124998605251312,
          16.571222076416017
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_171",
        "type": "box",
        "position": [
          161.5856170654297,
          0.6120029240846634,
          -90.35842895507812
        ],
        "size": [
          16.18193603515625,
          0.8124998605251312,
          37.27263427734375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_172",
        "type": "box",
        "position": [
          -50.92531394958496,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741204986572265,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_173",
        "type": "box",
        "position": [
          -58.238739013671875,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_174",
        "type": "box",
        "position": [
          -78.16802215576172,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_175",
        "type": "box",
        "position": [
          -70.8545913696289,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_176",
        "type": "box",
        "position": [
          -63.555397033691406,
          2.92164608836174,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.200639555454254,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_177",
        "type": "box",
        "position": [
          -103.68012237548828,
          2.92164608836174,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.200639555454254,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_178",
        "type": "box",
        "position": [
          -110.97931671142578,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_179",
        "type": "box",
        "position": [
          -118.2927474975586,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_180",
        "type": "box",
        "position": [
          -98.36347198486328,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_181",
        "type": "box",
        "position": [
          -91.05004119873047,
          2.9305531978607178,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.21845365524292,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_182",
        "type": "box",
        "position": [
          -83.75084686279297,
          2.92164608836174,
          -57.98727607727051
        ],
        "size": [
          9.741201171875,
          6.200639555454254,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_183",
        "type": "box",
        "position": [
          82.28,
          -5.8,
          -144.1
        ],
        "size": [
          34.86820770263672,
          1,
          31.61736083984375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_184",
        "type": "box",
        "position": [
          9.976813077926636,
          0.8740274310112,
          17.413978815078735
        ],
        "size": [
          4.792764911651611,
          0.11498499870300292,
          19.494290599823
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_185",
        "type": "box",
        "position": [
          9.796286344528198,
          0.8740274310112,
          -1.985215425491333
        ],
        "size": [
          4.792764911651611,
          0.11498499870300292,
          19.494290599823
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_186",
        "type": "box",
        "position": [
          9.8,
          0.88,
          -16.11
        ],
        "size": [
          4.657000789642334,
          0.1149848198890686,
          9.027380714416504
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_187",
        "type": "box",
        "position": [
          24.08,
          0.87,
          24.77
        ],
        "size": [
          29,
          0.11498499870300292,
          4.6862828826904295
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_188",
        "type": "box",
        "position": [
          24.58,
          0.88,
          45.7
        ],
        "size": [
          29.3,
          0.11498499870300292,
          4.686280975341797
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_189",
        "type": "box",
        "position": [
          9.976813077926636,
          0.8740274310112,
          53.19274139404297
        ],
        "size": [
          4.792764911651611,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_190",
        "type": "box",
        "position": [
          10.75656509399414,
          0.8740274310112,
          72.17628860473633
        ],
        "size": [
          4.792764434814453,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_191",
        "type": "box",
        "position": [
          -9.764335870742798,
          0.8740274310112,
          72.53474807739258
        ],
        "size": [
          4.792763957977295,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_192",
        "type": "box",
        "position": [
          -9.915139436721802,
          0.8740274310112,
          53.19274139404297
        ],
        "size": [
          4.792763957977295,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_193",
        "type": "box",
        "position": [
          -13.79,
          0.87,
          2.63
        ],
        "size": [
          10.8,
          0.11498499870300292,
          27.3
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_194",
        "type": "box",
        "position": [
          -10.538183212280273,
          0.8740274310112,
          18.069358825683594
        ],
        "size": [
          4.792764434814453,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_195",
        "type": "box",
        "position": [
          -23.25,
          0.88,
          24.77
        ],
        "size": [
          30.6,
          0.11498499870300292,
          4.6862828826904295
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_196",
        "type": "box",
        "position": [
          -24.02,
          0.87,
          45.73
        ],
        "size": [
          27,
          0.11498499870300292,
          4.686280975341797
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_197",
        "type": "box",
        "position": [
          -10.688985824584961,
          0.8740274310112,
          -20.631704330444336
        ],
        "size": [
          4.792764434814453,
          0.11498499870300292,
          19.494291076660158
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_198",
        "type": "box",
        "position": [
          -10.69,
          0.87,
          -42.3
        ],
        "size": [
          4.792764434814453,
          0.11498499870300292,
          26.8
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_199",
        "type": "box",
        "position": [
          151.47,
          0.87,
          -100.04
        ],
        "size": [
          4.565130004882812,
          0.11498499870300292,
          130
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_200",
        "type": "box",
        "position": [
          171.71,
          0.87,
          -85.74
        ],
        "size": [
          4.565130004882812,
          0.11498499870300292,
          140
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_201",
        "type": "box",
        "position": [
          68.29,
          1.94,
          19.49
        ],
        "size": [
          57,
          3.9099402113258837,
          0.5983636474609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_202",
        "type": "box",
        "position": [
          95.43,
          1.94,
          48.04
        ],
        "size": [
          0.775655517578125,
          3.9099402113258837,
          55.8
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_203",
        "type": "box",
        "position": [
          67.9,
          1.94,
          75.07
        ],
        "size": [
          56,
          3.9099402113258837,
          0.5983636474609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_204",
        "type": "box",
        "position": [
          -69.16,
          1.94,
          75.07
        ],
        "size": [
          60,
          3.909940226227045,
          0.5983636474609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_205",
        "type": "box",
        "position": [
          -95.09,
          1.94,
          42.94
        ],
        "size": [
          0.7756402587890625,
          3.909940226227045,
          65
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_206",
        "type": "box",
        "position": [
          -68.25,
          1.94,
          19.49
        ],
        "size": [
          58,
          3.909940226227045,
          0.5983636474609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_207",
        "type": "box",
        "position": [
          148.17681884765625,
          32.48147773742676,
          -9.414503931999207
        ],
        "size": [
          15.080587158203125,
          11.696290740966797,
          24.191616067886354
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_208",
        "type": "box",
        "position": [
          -39.86842918395996,
          -0.9529104232788086,
          -11.949554443359375
        ],
        "size": [
          61.47403884887695,
          2.2688939666748045,
          89.90714050292969
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_209",
        "type": "box",
        "position": [
          -99.91437530517578,
          -1.1419644355773926,
          -11.949554443359375
        ],
        "size": [
          61.474035034179686,
          2.2688939666748045,
          89.90714050292969
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_210",
        "type": "box",
        "position": [
          61.185930252075195,
          -1.1218338012695312,
          -11.207115173339844
        ],
        "size": [
          125.6816423034668,
          2.319293746948242,
          107.05495239257813
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_211",
        "type": "box",
        "position": [
          172.14173126220703,
          -1.1124489307403564,
          -11.694368362426758
        ],
        "size": [
          85.67444396972657,
          2.316493282318115,
          107.05494857788086
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_212",
        "type": "box",
        "position": [
          56.21344184875488,
          -8.19123101234436,
          -174.42279052734375
        ],
        "size": [
          125.6816423034668,
          2.737023601531982,
          119.74043823242188
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_213",
        "type": "box",
        "position": [
          -68.74007797241211,
          -8.26261281967163,
          -180.76553344726562
        ],
        "size": [
          125.68163848876954,
          2.512493858337402,
          107.05495239257813
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_214",
        "type": "box",
        "position": [
          135.8529052734375,
          0.6712370961904526,
          -77.7758846282959
        ],
        "size": [
          28.01,
          0.6358185207843781,
          28.010003814697267
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_215",
        "type": "box",
        "position": [
          108.54766845703125,
          0.6712370961904526,
          -77.7758846282959
        ],
        "size": [
          28.01,
          0.6358185207843781,
          28.010003814697267
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_216",
        "type": "box",
        "position": [
          108.54766845703125,
          0.6712370961904526,
          -104.6517562866211
        ],
        "size": [
          28.01,
          0.6358185207843781,
          28.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_217",
        "type": "box",
        "position": [
          134.78868103027344,
          0.36235225200653076,
          -104.6517562866211
        ],
        "size": [
          28.01,
          5.728412637710571,
          28.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_218",
        "type": "box",
        "position": [
          85.13947296142578,
          0.38252878189086914,
          -77.7758846282959
        ],
        "size": [
          20.64999938964844,
          4.778736839294433,
          28.010003814697267
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_219",
        "type": "box",
        "position": [
          85.13947296142578,
          0.38252878189086914,
          -105.27951049804688
        ],
        "size": [
          20.64999938964844,
          4.778736839294433,
          28.01
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_220",
        "type": "box",
        "position": [
          92.4506721496582,
          -5.765964508056641,
          -84.93686294555664
        ],
        "size": [
          117.5460336303711,
          11.790853271484375,
          86.49064422607422
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_221",
        "type": "box",
        "position": [
          167.15191650390625,
          -8.918939113616943,
          -169.76338958740234
        ],
        "size": [
          95.94283081054688,
          2.737023124694824,
          83.68524719238282
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_222",
        "type": "box",
        "position": [
          181.97230529785156,
          0.8411778211593628,
          -69.1202392578125
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_223",
        "type": "box",
        "position": [
          181.97230529785156,
          0.8411778211593628,
          -78.19326782226562
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_224",
        "type": "box",
        "position": [
          181.97230529785156,
          0.8411778211593628,
          -87.16405487060547
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_225",
        "type": "box",
        "position": [
          181.97230529785156,
          0.8411778211593628,
          -96.14756774902344
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_226",
        "type": "box",
        "position": [
          181.74363708496094,
          0.8411778211593628,
          -105.2826156616211
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_227",
        "type": "box",
        "position": [
          194.5325164794922,
          -3.006011486053467,
          -93.20339965820312
        ],
        "size": [
          45.55000854492187,
          7.174983749389648,
          74.45000244140626
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_228",
        "type": "box",
        "position": [
          190.42543029785156,
          0.8411778211593628,
          -105.2826156616211
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_229",
        "type": "box",
        "position": [
          198.86915588378906,
          0.8411778211593628,
          -105.2826156616211
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_230",
        "type": "box",
        "position": [
          198.86915588378906,
          0.8411778211593628,
          -114.11004638671875
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_231",
        "type": "box",
        "position": [
          190.42543029785156,
          0.8411778211593628,
          -114.11004638671875
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_232",
        "type": "box",
        "position": [
          181.74363708496094,
          0.8411778211593628,
          -114.11331939697266
        ],
        "size": [
          8.42705322265625,
          0.26,
          9.065831909179687
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_233",
        "type": "box",
        "position": [
          130.39558029174805,
          -6.637089967727661,
          -150.46542739868164
        ],
        "size": [
          37.15350128173828,
          0.7400276756286621,
          45.47462249755859
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_234",
        "type": "box",
        "position": [
          104.8,
          -5.96,
          -179.14
        ],
        "size": [
          21.050000915527345,
          0.5064823722839356,
          40
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_235",
        "type": "box",
        "position": [
          125.42,
          -5.96,
          -185.63
        ],
        "size": [
          20.4,
          0.5064823722839356,
          26.3
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_236",
        "type": "box",
        "position": [
          120.81805801391602,
          -5.95515513420105,
          -202.68157958984375
        ],
        "size": [
          30.09000946044922,
          0.5064823722839356,
          20.33000732421875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_237",
        "type": "box",
        "position": [
          142.75,
          -5.96,
          -192.98
        ],
        "size": [
          21.050008544921877,
          0.5064823722839356,
          40
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_238",
        "type": "box",
        "position": [
          64.09067344665527,
          -6.121493101119995,
          -167.87081909179688
        ],
        "size": [
          71.02997756958008,
          0.41000009536743165,
          17.80998779296875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_239",
        "type": "box",
        "position": [
          64.09067344665527,
          -6.121493101119995,
          -219.98451232910156
        ],
        "size": [
          71.02997756958008,
          0.41000009536743165,
          17.810018310546877
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_240",
        "type": "box",
        "position": [
          42.64420413970947,
          -6.121493101119995,
          -204.46568298339844
        ],
        "size": [
          31.149982223510744,
          0.41000009536743165,
          17.810018310546877
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_241",
        "type": "box",
        "position": [
          -4.442264556884766,
          -6.121493101119995,
          -214.12228393554688
        ],
        "size": [
          71.02998138427735,
          0.41000009536743165,
          17.80998779296875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_242",
        "type": "box",
        "position": [
          -45.981231689453125,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_243",
        "type": "box",
        "position": [
          -26.045724868774414,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973909149169923,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_244",
        "type": "box",
        "position": [
          26.3908634185791,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973909149169923,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_245",
        "type": "box",
        "position": [
          66.43821716308594,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_246",
        "type": "box",
        "position": [
          46.50271224975586,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973905334472658,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_247",
        "type": "box",
        "position": [
          -86.31328582763672,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_248",
        "type": "box",
        "position": [
          -106.28633117675781,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_249",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          77.49208068847656
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_250",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          56.99493598937988
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989778289794923
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_251",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          36.88803768157959
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98977638244629
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_252",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          16.79483437538147
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989777812957765
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_253",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -43.744667053222656
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989774475097658
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_254",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -23.637770652770996
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98977638244629
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_255",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -3.140625
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989778289794923
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_256",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -63.30802536010742
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989774475097658
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_257",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -83.80517578125
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_258",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -103.91206359863281
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_259",
        "type": "box",
        "position": [
          -129.23204040527344,
          5.815304405987263,
          -124.0052719116211
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_260",
        "type": "box",
        "position": [
          -129.23204040527344,
          -1.4867916107177734,
          -202.91122436523438
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_261",
        "type": "box",
        "position": [
          -129.23204040527344,
          -1.4867916107177734,
          -182.81800842285156
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_262",
        "type": "box",
        "position": [
          -129.23204040527344,
          -1.4867916107177734,
          -162.71112060546875
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_263",
        "type": "box",
        "position": [
          -129.23204040527344,
          -1.4867916107177734,
          -142.21397399902344
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_264",
        "type": "box",
        "position": [
          -129.23204040527344,
          -1.4867916107177734,
          -222.89535522460938
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_265",
        "type": "box",
        "position": [
          -78.6727294921875,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.97391296386719,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_266",
        "type": "box",
        "position": [
          -58.560882568359375,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.97391296386719,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_267",
        "type": "box",
        "position": [
          -118.8659782409668,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973905334472658,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_268",
        "type": "box",
        "position": [
          -98.89293670654297,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.97391296386719,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_269",
        "type": "box",
        "position": [
          -18.537818908691406,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973909149169923,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_270",
        "type": "box",
        "position": [
          -38.510865211486816,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973911056518556,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_271",
        "type": "box",
        "position": [
          21.794236183166504,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973911056518556,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_272",
        "type": "box",
        "position": [
          1.6823883056640625,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973909149169923,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_273",
        "type": "box",
        "position": [
          81.7257308959961,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.97391296386719,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_274",
        "type": "box",
        "position": [
          106.03461456298828,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          30.65390563964844,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_275",
        "type": "box",
        "position": [
          41.53247928619385,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.973911056518556,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_276",
        "type": "box",
        "position": [
          61.505523681640625,
          -1.8606281280517578,
          -232.13070678710938
        ],
        "size": [
          22.97391296386719,
          11.584149131774902,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_277",
        "type": "box",
        "position": [
          106.11679077148438,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_278",
        "type": "box",
        "position": [
          126.05229949951172,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_279",
        "type": "box",
        "position": [
          86.00494384765625,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.97391296386719,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_280",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -3.140625
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989778289794923
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_281",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -23.637770652770996
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98977638244629
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_282",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          16.79483437538147
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989777812957765
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_283",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          36.88803768157959
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98977638244629
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_284",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          56.99493598937988
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989778289794923
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_285",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          77.49208068847656
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_286",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -44.667724609375
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989774475097658
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_287",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -65.16487312316895
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.989778289794923
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_288",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -85.27176666259766
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_289",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -105.36497497558594
        ],
        "size": [
          1.48918701171875,
          11.584148878455162,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_290",
        "type": "box",
        "position": [
          215.95314025878906,
          5.815304405987263,
          -122.88615036010742
        ],
        "size": [
          1.37572265625,
          11.584148878455162,
          17.871030578613283
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_291",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -221.05059814453125
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_292",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -241.54776000976562
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_293",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -201.11514282226562
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_294",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -181.02194213867188
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_295",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -160.9150390625
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_296",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -140.41790771484375
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.989766845703127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_297",
        "type": "box",
        "position": [
          215.95314025878906,
          -4.8334641456604,
          -261.7563247680664
        ],
        "size": [
          1.48918701171875,
          11.584149131774902,
          22.98978210449219
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_298",
        "type": "box",
        "position": [
          205.95286560058594,
          -4.8334641456604,
          -270.76068115234375
        ],
        "size": [
          22.9922998046875,
          11.584149131774902,
          1.6392724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_299",
        "type": "box",
        "position": [
          185.4561309814453,
          -4.8334641456604,
          -270.62652587890625
        ],
        "size": [
          22.9922998046875,
          11.584149131774902,
          1.6392724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_300",
        "type": "box",
        "position": [
          144.66009521484375,
          -4.8334641456604,
          -270.62652587890625
        ],
        "size": [
          22.9922998046875,
          11.584149131774902,
          1.6392724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_301",
        "type": "box",
        "position": [
          165.15682983398438,
          -4.8334641456604,
          -270.76068115234375
        ],
        "size": [
          22.9922998046875,
          11.584149131774902,
          1.6392724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_302",
        "type": "box",
        "position": [
          124.50115585327148,
          -4.8334641456604,
          -270.76068115234375
        ],
        "size": [
          22.992307434082033,
          11.584149131774902,
          1.6392724609375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_303",
        "type": "box",
        "position": [
          114.81556701660156,
          -4.8334641456604,
          -259.92845916748047
        ],
        "size": [
          1.2477166748046875,
          11.584149131774902,
          22.983648071289064
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_304",
        "type": "box",
        "position": [
          114.81556701660156,
          -4.8334641456604,
          -241.72744750976562
        ],
        "size": [
          1.2477166748046875,
          11.584149131774902,
          22.983663330078127
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_305",
        "type": "box",
        "position": [
          -122.52295684814453,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          14.653905639648437,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_306",
        "type": "box",
        "position": [
          146.87757873535156,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973897705078127,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_307",
        "type": "box",
        "position": [
          186.9249267578125,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973897705078127,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_308",
        "type": "box",
        "position": [
          166.9894256591797,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973897705078127,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_309",
        "type": "box",
        "position": [
          204.77810668945312,
          5.815304405987263,
          89.74105834960938
        ],
        "size": [
          22.973897705078127,
          11.584148878455162,
          0.980489501953125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_310",
        "type": "box",
        "position": [
          23.970670700073242,
          -3.488199234008789,
          -132.0085220336914
        ],
        "size": [
          11.326028594970703,
          4.876588592529297,
          4.440923461914062
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_311",
        "type": "box",
        "position": [
          -22.02057456970215,
          -3.488199234008789,
          -132.0085220336914
        ],
        "size": [
          11.326028594970703,
          4.876588592529297,
          4.440923461914062
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_312",
        "type": "box",
        "position": [
          -11.518094062805176,
          -2.1045210361480713,
          -131.2685775756836
        ],
        "size": [
          2.915353546142578,
          7.64392972946167,
          2.9110162353515623
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_313",
        "type": "box",
        "position": [
          14.26524829864502,
          -3.562504529953003,
          -132.04850006103516
        ],
        "size": [
          5.2502782440185545,
          4.727970371246338,
          3.6481378173828123
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_314",
        "type": "box",
        "position": [
          -6.80722713470459,
          -0.5344703197479248,
          -131.29956817626953
        ],
        "size": [
          3.7451589202880857,
          10.784031162261963,
          2.8790948486328123
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_315",
        "type": "box",
        "position": [
          -15.119001388549805,
          -2.450201988220215,
          -131.7832260131836
        ],
        "size": [
          2.5840089416503904,
          6.952590713500976,
          2.2802484130859373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_316",
        "type": "box",
        "position": [
          -10.585102319717407,
          -3.488199234008789,
          -134.31157684326172
        ],
        "size": [
          11.326028118133545,
          4.876588592529297,
          4.440923461914062
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_317",
        "type": "box",
        "position": [
          -33.12758541107178,
          -3.488199234008789,
          -132.8966293334961
        ],
        "size": [
          11.32602668762207,
          4.876588592529297,
          4.440923461914062
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_318",
        "type": "box",
        "position": [
          -50.580867767333984,
          4.945287227630615,
          -124.64096069335938
        ],
        "size": [
          6.0609033203125,
          8.801789054870605,
          5.686910400390625
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_319",
        "type": "box",
        "position": [
          -43.763160705566406,
          9.238735228776932,
          -126.3593635559082
        ],
        "size": [
          6.034856567382812,
          17.388639161586763,
          2.879087219238281
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_320",
        "type": "box",
        "position": [
          -115.46389770507812,
          3.348948836326599,
          -76.60836791992188
        ],
        "size": [
          24.53532958984375,
          6.084427843093872,
          28.111272583007814
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_321",
        "type": "box",
        "position": [
          -36.08,
          2.33,
          -129.69
        ],
        "size": [
          70,
          3.51,
          1.76
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_322",
        "type": "box",
        "position": [
          29.77,
          1.95,
          -129.81
        ],
        "size": [
          42,
          2.76,
          1.26
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_323",
        "type": "box",
        "position": [
          151.91342544555664,
          -13.122849464416504,
          -224.75547790527344
        ],
        "size": [
          123.66923309326172,
          4.208427200317383,
          92.45003295898438
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_324",
        "type": "box",
        "position": [
          196.45484924316406,
          1.3005013465881348,
          18.43533992767334
        ],
        "size": [
          38.58992553710937,
          3.1502349472045896,
          37.244102249145506
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_325",
        "type": "box",
        "position": [
          196.45484924316406,
          -1.2158551216125488,
          -23.957563400268555
        ],
        "size": [
          38.58992553710937,
          3.1502349472045896,
          37.24410415649414
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_326",
        "type": "box",
        "position": [
          166.0575714111328,
          -1.1124489307403564,
          -11.694368362426758
        ],
        "size": [
          88.51244140625,
          2.316493282318115,
          107.05494857788086
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_327",
        "type": "box",
        "position": [
          113.38915634155273,
          -1.1124489307403564,
          55.86863136291504
        ],
        "size": [
          205.36926055908202,
          2.316493282318115,
          66.20234848022461
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_328",
        "type": "box",
        "position": [
          -69.45,
          -2.91,
          55.87
        ],
        "size": [
          120.59045196533204,
          2.316493282318115,
          70
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_329",
        "type": "box",
        "position": [
          -78.49045181274414,
          2.246999740600586,
          -227.35553741455078
        ],
        "size": [
          7.035733947753906,
          18.52675033569336,
          7.046666870117187
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_330",
        "type": "box",
        "position": [
          -103.4980354309082,
          2.246999740600586,
          -227.35553741455078
        ],
        "size": [
          7.035733947753906,
          18.52675033569336,
          7.046666870117187
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_331",
        "type": "box",
        "position": [
          63.55,
          6.87,
          -94.23
        ],
        "size": [
          23.3,
          0.6740510559082031,
          17.8
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_332",
        "type": "box",
        "position": [
          60.77,
          6.88,
          -113.14
        ],
        "size": [
          28.7,
          0.708488712310791,
          23.4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_333",
        "type": "box",
        "position": [
          0.12086296081542969,
          0.6120080053806305,
          131.17224502563477
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060193786621095
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_334",
        "type": "box",
        "position": [
          0.23507118225097656,
          0.6120080053806305,
          115.44574737548828
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060186157226564
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_335",
        "type": "box",
        "position": [
          0.32514381408691406,
          0.4922490753233433,
          99.63726043701172
        ],
        "size": [
          16.060191879272463,
          0.8125095388293266,
          16.060186157226564
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_336",
        "type": "box",
        "position": [
          0.3860645294189453,
          0.6120080053806305,
          51.56720733642578
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060193786621095
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_337",
        "type": "box",
        "position": [
          0.47727012634277344,
          0.425496531650424,
          83.21980285644531
        ],
        "size": [
          16.060191879272463,
          0.8125095202028751,
          16.060186157226564
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_338",
        "type": "box",
        "position": [
          0.2557964324951172,
          0.6120080053806305,
          67.70909690856934
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.06018997192383
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_339",
        "type": "box",
        "position": [
          0.07758140563964844,
          0.6120080053806305,
          35.40913391113281
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060193786621095
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_340",
        "type": "box",
        "position": [
          16.141653537750244,
          0.6120080053806305,
          35.36464595794678
        ],
        "size": [
          16.060189018249513,
          0.8125094866752625,
          16.060188064575197
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_341",
        "type": "box",
        "position": [
          32.001296043395996,
          0.6120080053806305,
          35.4601354598999
        ],
        "size": [
          16.060188064575197,
          0.8125094866752625,
          16.060188064575197
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_342",
        "type": "box",
        "position": [
          -15.997724771499634,
          0.6120080053806305,
          35.4601354598999
        ],
        "size": [
          16.06018949508667,
          0.8125094866752625,
          16.060188064575197
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_343",
        "type": "box",
        "position": [
          -31.857375144958496,
          0.6120080053806305,
          35.36464595794678
        ],
        "size": [
          16.060188064575197,
          0.8125094866752625,
          16.060188064575197
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_344",
        "type": "box",
        "position": [
          -0.2818584442138672,
          0.6120080053806305,
          19.32200288772583
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.06019283294678
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_345",
        "type": "box",
        "position": [
          -0.34113502502441406,
          0.6120080053806305,
          3.348285675048828
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060191879272463
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_346",
        "type": "box",
        "position": [
          -0.4115772247314453,
          0.6120080053806305,
          -12.513363361358643
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.06019283294678
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_347",
        "type": "box",
        "position": [
          -0.4962749481201172,
          0.6120080053806305,
          -28.510772705078125
        ],
        "size": [
          16.060191879272463,
          0.8125094866752625,
          16.060193786621095
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_348",
        "type": "box",
        "position": [
          72.27,
          3.26,
          -65.86
        ],
        "size": [
          3.7,
          6.145836720466614,
          17.40250946044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_349",
        "type": "box",
        "position": [
          72.89146041870117,
          1.6351892948150635,
          -66.18760108947754
        ],
        "size": [
          2.0710885620117185,
          1.9255488014221191,
          14.937532196044922
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_350",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351892948150635,
          -66.60555267333984
        ],
        "size": [
          3.4815194702148435,
          1.9255488014221191,
          2.07109619140625
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_351",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351892948150635,
          -58.71013069152832
        ],
        "size": [
          3.4815194702148435,
          1.9255488014221191,
          2.071092376708984
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_352",
        "type": "box",
        "position": [
          66.55531692504883,
          1.6351892948150635,
          -68.65180206298828
        ],
        "size": [
          3.4815194702148435,
          1.9255488014221191,
          2.07109619140625
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_353",
        "type": "box",
        "position": [
          -43.15311813354492,
          2.3434058725833893,
          38.76961326599121
        ],
        "size": [
          7.6016976928710935,
          3.237430999279022,
          3.547197113037109
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_354",
        "type": "box",
        "position": [
          -28.269343376159668,
          0.3220776319503784,
          -9.365943372249603
        ],
        "size": [
          31.498878250122072,
          0.584899435043335,
          16.41705978870392
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_355",
        "type": "box",
        "position": [
          -22.138947010040283,
          4.058908581733704,
          -1.3069517612457275
        ],
        "size": [
          19.222531089782716,
          7.675300130844116,
          0.46566439628601075
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_356",
        "type": "box",
        "position": [
          -35.00304412841797,
          4.2505409717559814,
          -37.4425163269043
        ],
        "size": [
          0.43153167724609376,
          7.292031536102295,
          10.16789794921875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_357",
        "type": "box",
        "position": [
          -21.745351314544678,
          4.247235417366028,
          -33.34333038330078
        ],
        "size": [
          18.143111000061037,
          7.298646459579468,
          0.4456689453125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_358",
        "type": "box",
        "position": [
          -44.47414970397949,
          3.9630942344665527,
          -3.163347601890564
        ],
        "size": [
          0.4091508483886719,
          7.866932640075683,
          4.22733021736145
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_359",
        "type": "box",
        "position": [
          -39.52484893798828,
          4.058908581733704,
          -32.443172454833984
        ],
        "size": [
          9.018110046386719,
          7.675300130844116,
          0.42719818115234376
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_360",
        "type": "box",
        "position": [
          98.29206085205078,
          3.4081459045410156,
          -13.526407241821289
        ],
        "size": [
          35.30708862304687,
          0.7608401870727539,
          0.21714187622070313
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_361",
        "type": "box",
        "position": [
          101.17124938964844,
          5.323970556259155,
          -13.526378631591797
        ],
        "size": [
          3.75090576171875,
          2.676628360748291,
          0.21715713500976563
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_362",
        "type": "box",
        "position": [
          92.59020614624023,
          1.5168051719665527,
          1.9871830940246582
        ],
        "size": [
          9.181211242675781,
          1.330368766784668,
          0.06177879333496094
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_363",
        "type": "box",
        "position": [
          98.47,
          5.46,
          2.08
        ],
        "size": [
          35.3,
          11.2,
          0.5
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_364",
        "type": "box",
        "position": [
          98.4127197265625,
          6.862990379333496,
          -13.261748313903809
        ],
        "size": [
          35.5484521484375,
          0.16535354614257813,
          3.9452321624755857
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_365",
        "type": "box",
        "position": [
          83.5999984741211,
          0.002275705337524414,
          -8.731077075004578
        ],
        "size": [
          6.526403198242187,
          0.16535497665405274,
          9.848024377822876
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_366",
        "type": "box",
        "position": [
          101.42956161499023,
          0.002258777618408203,
          -5.870285749435425
        ],
        "size": [
          29.152723083496095,
          0.16535736083984376,
          15.569610843658447
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_1",
        "type": "box",
        "position": [
          65.95,
          0.67,
          46.23
        ],
        "size": [
          55,
          0.6358185207843781,
          56
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_2",
        "type": "box",
        "position": [
          40.07,
          1.94,
          59.7
        ],
        "size": [
          0.7277658081054688,
          3.9099402113258837,
          32
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          40.07394790649414,
          1.9391471352428198,
          23.152225494384766
        ],
        "size": [
          0.6599252319335938,
          3.9099402113258837,
          7.288388977050781
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_4",
        "type": "box",
        "position": [
          -66.31,
          0.67,
          45.93
        ],
        "size": [
          55,
          0.6358185207843781,
          56
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_5",
        "type": "box",
        "position": [
          -39.531898498535156,
          1.9391471277922392,
          23.152225494384766
        ],
        "size": [
          0.6599252319335938,
          3.909940226227045,
          7.288388977050781
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_6",
        "type": "box",
        "position": [
          -39.53,
          1.94,
          60.1
        ],
        "size": [
          0.7277581787109375,
          3.909940226227045,
          32
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_7",
        "type": "box",
        "position": [
          36.428266525268555,
          12.283348083496094,
          -91.470703125
        ],
        "size": [
          2.4230363464355467,
          7.866929779052734,
          42.033239135742186
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_8",
        "type": "box",
        "position": [
          -12.96,
          8.19,
          -17.14
        ],
        "size": [
          1.7869546508789063,
          16,
          32.7
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_367",
        "type": "box",
        "position": [
          118.86692810058594,
          0.0022666454315185547,
          -6.7246376276016235
        ],
        "size": [
          5.742009887695312,
          0.16533685684204102,
          8.475882062911987
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_368",
        "type": "box",
        "position": [
          122.06475830078125,
          3.445573568344116,
          -3.527279257774353
        ],
        "size": [
          0.5530908203125,
          6.844834575653076,
          0.6831364727020264
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_369",
        "type": "box",
        "position": [
          118.67,
          4.24,
          -2.65
        ],
        "size": [
          28.90703369140625,
          0.9336319065093994,
          4.5924484825134275
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_370",
        "type": "box",
        "position": [
          103.68407440185547,
          0.44260311126708984,
          2.154719352722168
        ],
        "size": [
          0.6292779541015625,
          0.4218661880493164,
          0.1561458206176758
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_371",
        "type": "box",
        "position": [
          103.68407821655273,
          0.435971736907959,
          2.2078590393066406
        ],
        "size": [
          0.31963897705078126,
          0.26243568420410157,
          0.14286304473876954
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_372",
        "type": "box",
        "position": [
          96.42159652709961,
          12.545740604400635,
          -14.271434783935547
        ],
        "size": [
          32.531583557128904,
          2.2106101608276365,
          0.21711517333984376
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_373",
        "type": "box",
        "position": [
          111.11363983154297,
          1.465024471282959,
          1.9871845245361328
        ],
        "size": [
          9.301885375976562,
          1.4857022857666016,
          0.11356044769287109
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_374",
        "type": "box",
        "position": [
          101.8217544555664,
          1.4909141063690186,
          1.9871830940246582
        ],
        "size": [
          9.301885375976562,
          1.4857027626037598,
          0.11355758666992187
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_375",
        "type": "box",
        "position": [
          110.26891708374023,
          7.564566373825073,
          -15.088705062866211
        ],
        "size": [
          11.474012145996094,
          1.5064947700500488,
          0.14292312622070313
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_376",
        "type": "box",
        "position": [
          121.81298446655273,
          4.332197666168213,
          -4.10702383518219
        ],
        "size": [
          0.09773040771484375,
          3.957968482971191,
          0.3521123027801514
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_377",
        "type": "box",
        "position": [
          121.81338119506836,
          1.175926685333252,
          -4.450676798820496
        ],
        "size": [
          0.09046722412109375,
          2.3745782470703123,
          1.0110626316070557
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_378",
        "type": "box",
        "position": [
          121.81298446655273,
          4.332197666168213,
          -4.4491353034973145
        ],
        "size": [
          0.09773040771484375,
          3.957968482971191,
          0.3521125411987305
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_379",
        "type": "box",
        "position": [
          121.81298446655273,
          4.332197666168213,
          -4.785699129104614
        ],
        "size": [
          0.09773040771484375,
          3.957968482971191,
          0.3521120643615723
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_380",
        "type": "box",
        "position": [
          90.05606079101562,
          4.867100715637207,
          2.033684730529785
        ],
        "size": [
          5.802343139648437,
          1.817474136352539,
          0.07233882904052734
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_381",
        "type": "box",
        "position": [
          95.84839630126953,
          4.867100954055786,
          2.033684730529785
        ],
        "size": [
          5.802343139648437,
          1.8174746131896973,
          0.07233882904052734
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_382",
        "type": "box",
        "position": [
          101.64073944091797,
          4.867101192474365,
          2.033684730529785
        ],
        "size": [
          5.802343139648437,
          1.8174750900268555,
          0.07234455108642578
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_383",
        "type": "box",
        "position": [
          113.22542572021484,
          4.867100954055786,
          2.0442371368408203
        ],
        "size": [
          5.802343139648437,
          1.8174746131896973,
          0.07234455108642578
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_384",
        "type": "box",
        "position": [
          -69.19,
          6.62,
          -95.71
        ],
        "size": [
          21.8,
          9.8,
          17.6
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_385",
        "type": "box",
        "position": [
          -43.62611961364746,
          2.92164608836174,
          -57.98727607727051
        ],
        "size": [
          9.741204986572265,
          6.200639555454254,
          6.419671783447265
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_386",
        "type": "box",
        "position": [
          48.8,
          -4.57,
          -144.1
        ],
        "size": [
          34.86820960998535,
          0.2,
          31.61736083984375
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_387",
        "type": "box",
        "position": [
          61.5865535736084,
          -4.081028938293457,
          -154.3937225341797
        ],
        "size": [
          4.097299346923828,
          3.3451764678955076,
          4.048604736328125
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_388",
        "type": "box",
        "position": [
          128.5543441772461,
          1.053227424621582,
          -105.85836791992188
        ],
        "size": [
          10.658178100585937,
          7.722533950805664,
          10.543660888671875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_389",
        "type": "box",
        "position": [
          128.5543441772461,
          8.214873313903809,
          -105.85836791992188
        ],
        "size": [
          10.658178100585937,
          7.722549209594726,
          10.543660888671875
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_390",
        "type": "box",
        "position": [
          -0.09,
          3.14,
          85.51
        ],
        "size": [
          25.490615615844728,
          15.9,
          5.2896249389648435
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_3",
        "type": "mesh",
        "meshName": "group390018422",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_4",
        "type": "mesh",
        "meshName": "group1843978213",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "group1843978213",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "group1843978213",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "group261381488",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "mesh1991778875",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "group221871850",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "group460821234",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "group75069527",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_3",
        "type": "mesh",
        "meshName": "group1404208830",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_4",
        "type": "mesh",
        "meshName": "group195881240",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "group195881240",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "mesh355743645_1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "mesh355743645_1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "group1761933569",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "mesh1872271078",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "group1403849005",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "group31865945",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "group1074427276",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_13",
        "type": "mesh",
        "meshName": "group292347461",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_14",
        "type": "mesh",
        "meshName": "mesh636357533_1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "mesh",
        "meshName": "mesh692021628",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "mesh",
        "meshName": "group1616195246",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "mesh",
        "meshName": "group285777586",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "mesh",
        "meshName": "group285777586",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "mesh",
        "meshName": "group1616195246",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "mesh",
        "meshName": "group1568455134",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "mesh",
        "meshName": "group75069527",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "mesh",
        "meshName": "group793639644",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "mesh",
        "meshName": "group1571599695",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "mesh",
        "meshName": "group75069527",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "mesh",
        "meshName": "group600838634",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "mesh",
        "meshName": "mesh1354776916_1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "mesh",
        "meshName": "mesh1016643633",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          98.49,
          2.44,
          -16.25
        ],
        "rotation": [
          43,
          0,
          0
        ],
        "size": [
          4,
          5.2,
          0.2
        ],
        "materialType": "ground",
        "meshName": "mesh187140086_1"
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          49.71,
          2.82,
          -96.07
        ],
        "rotation": [
          31,
          0,
          0
        ],
        "size": [
          3.8,
          2.4,
          13.5
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          4.32,
          -4.3,
          -135.35
        ],
        "rotation": [
          -43,
          0,
          0
        ],
        "size": [
          9.1,
          1.1,
          13.4
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_86",
        "type": "box",
        "position": [
          160.53,
          -7.56,
          -174.8
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "size": [
          15.2,
          8.5,
          15.7
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_87",
        "type": "box",
        "position": [
          135,
          1.6,
          -234.58
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "size": [
          35.4,
          17.7,
          42.6
        ],
        "materialType": "ground",
        "meshName": null
      }
    ],
    "placeableBlocks": [],
    "npcs": [
      {
        "type": "punk",
        "position": [
          9.64,
          1.34,
          18.98
        ],
        "modelUrl": "assets/npc/Punk.glb",
        "patrolPoints": [
          [
            9.55,
            1.5,
            22.04,
            0.5
          ],
          [
            9.84,
            1.5,
            -16.45,
            0.5
          ],
          [
            78.37,
            1.5,
            -18.53,
            0.5
          ],
          [
            149.9,
            1.5,
            -17.59,
            0.5
          ],
          [
            148.11,
            1.5,
            -37.88,
            0.5
          ],
          [
            9.19,
            1.5,
            -39.51,
            0.5
          ],
          [
            8.14,
            1.5,
            22.45,
            0.5
          ]
        ],
        "speed": 5,
        "scale": 2.4,
        "chaseRange": 0,
        "id": 3,
        "patrolBehavior": "pingpong",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 0.5
      },
      {
        "type": "Worker",
        "position": [
          -10.62,
          1.33,
          -54.07
        ],
        "modelUrl": "assets/npc/Worker.glb",
        "patrolPoints": [
          [
            -10.92,
            1.5,
            -47.86,
            0.5
          ],
          [
            -9.03,
            1.5,
            10.01,
            0.5
          ],
          [
            -10.21,
            1.5,
            25.26,
            0.5
          ],
          [
            -35.41,
            1.5,
            24.55,
            0.5
          ],
          [
            -35.21,
            1,
            45.94,
            0.5
          ],
          [
            -10.64,
            1.5,
            45.79,
            0.5
          ],
          [
            35.61,
            1.5,
            45.39,
            0.5
          ],
          [
            35.94,
            1.5,
            24.95,
            0.5
          ],
          [
            10.29,
            1.5,
            24.87,
            0.5
          ],
          [
            9.53,
            1.5,
            -18.2,
            0.5
          ],
          [
            7.84,
            1.5,
            -38.47,
            0.5
          ],
          [
            -3.22,
            1.5,
            -39.06,
            0.5
          ],
          [
            -3.67,
            1.5,
            -48.73,
            0.5
          ],
          [
            -11.33,
            1.5,
            -48.44,
            0.5
          ]
        ],
        "speed": 5,
        "scale": 2.4,
        "chaseRange": 0,
        "id": 7,
        "patrolBehavior": "pingpong",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 0.5
      },
      {
        "type": "woman",
        "position": [
          42.55,
          2,
          -69.34
        ],
        "modelUrl": "assets/npc/Woman.glb",
        "patrolPoints": [
          [
            41.22274884204704,
            2.5764801123919483,
            -77.16854550835475,
            0.5
          ],
          [
            38.18981436767796,
            2.5764801123919483,
            -122.73059893652028,
            0.5
          ],
          [
            -3.9,
            2.58,
            -123.63,
            0.5
          ],
          [
            -12.77,
            2.58,
            -118.26,
            0.5
          ],
          [
            -31.61,
            2.58,
            -98.62,
            0.5
          ],
          [
            -29.31,
            2.5,
            -71.88,
            0.5
          ],
          [
            -11.98,
            2,
            -63.85,
            0.5
          ],
          [
            22.16,
            2.58,
            -67.33,
            0.5
          ],
          [
            39.88,
            2.58,
            -68.95,
            0.5
          ]
        ],
        "speed": 5,
        "scale": 1,
        "chaseRange": 0,
        "id": 14,
        "patrolBehavior": "pingpong",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 0.5
      },
      {
        "type": "suitM",
        "position": [
          -42.02,
          8.48,
          -16.94
        ],
        "modelUrl": "assets/npc/BusinessMan.glb",
        "patrolPoints": [
          [
            -42.12,
            8.78,
            -28.87,
            2
          ],
          [
            -42.02655876723237,
            8.484718854585838,
            -16.75121622059895,
            2
          ],
          [
            -42.22,
            8.88,
            -4.33,
            2
          ]
        ],
        "speed": 5,
        "scale": 2.1,
        "chaseRange": 0,
        "id": 60,
        "patrolBehavior": "random",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 2
      },
      {
        "type": "casual",
        "position": [
          -42.53,
          1.01,
          -17.42
        ],
        "modelUrl": "assets/npc/CasualCharacter.glb",
        "patrolPoints": [
          [
            -42.47,
            1.01,
            -29.25,
            0.5
          ],
          [
            -42.31,
            1.01,
            -6.4,
            0.5
          ],
          [
            -42.49,
            1.01,
            -16.56,
            0.5
          ]
        ],
        "speed": 5,
        "scale": 2.1,
        "chaseRange": 0,
        "id": 223,
        "patrolBehavior": "random",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 0.5
      },
      {
        "type": "punk",
        "position": [
          40.74,
          9.32,
          -108.9
        ],
        "modelUrl": "assets/npc/Punk.glb",
        "patrolPoints": [
          [
            40.08,
            9.6,
            -96.63,
            2
          ],
          [
            40.49,
            9.6,
            -96.78,
            2
          ],
          [
            40.9,
            9.6,
            -87.13,
            2
          ],
          [
            40.59,
            9.6,
            -75.41,
            2
          ],
          [
            40.41,
            9.6,
            -107.79,
            2
          ]
        ],
        "speed": 5,
        "scale": 2.7,
        "chaseRange": 0,
        "id": 66,
        "patrolBehavior": "loop",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 2
      },
      {
        "type": "casual",
        "position": [
          51.11,
          7.63,
          -63.23
        ],
        "modelUrl": "assets/npc/CasualCharacter.glb",
        "patrolPoints": [
          [
            50.52,
            7.9,
            -80.76,
            2
          ],
          [
            63.82,
            7.9,
            -79.93,
            2
          ],
          [
            65.06,
            7.9,
            -65.81,
            2
          ],
          [
            66.59,
            7.9,
            -60.94,
            2
          ],
          [
            52.50342917549759,
            7.030829204528933,
            -61.689326856756296,
            2
          ],
          [
            50.27,
            7.9,
            -79.49,
            2
          ]
        ],
        "speed": 5,
        "scale": 2.6,
        "chaseRange": 0,
        "id": 303,
        "patrolBehavior": "pingpong",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 2
      },
      {
        "type": "suitM",
        "position": [
          51,
          1.13,
          -106.27
        ],
        "modelUrl": "assets/npc/BusinessMan.glb",
        "patrolPoints": [
          [
            51.46,
            1.33,
            -113.43,
            1.5
          ],
          [
            52.18,
            1.23,
            -121.22,
            1.5
          ],
          [
            60.73,
            1.13,
            -122.15,
            1.5
          ],
          [
            59.8,
            1.13,
            -103.02,
            1.5
          ],
          [
            59.96,
            1.13,
            -93.77,
            1.5
          ],
          [
            60.42,
            1.13,
            -85.98,
            1.5
          ],
          [
            60.87,
            1.13,
            -63.57,
            1.5
          ],
          [
            50.02,
            1.13,
            -63.59,
            1.5
          ],
          [
            56.55,
            1.13,
            -106.52,
            1.5
          ]
        ],
        "speed": 2,
        "scale": 2.4,
        "chaseRange": 0,
        "id": 659,
        "patrolBehavior": "pingpong",
        "currentPatrolIndex": 0,
        "isMoving": true,
        "waitTime": 1.5
      }
    ],
    "platforms": [],
    "interactiveObjects": [],
    "triggers": [],
    "meshAnimations": [
      {
        "meshName": "Lift2",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -225.86,
              10.11,
              124.18
            ],
            [
              -229.68,
              9.65,
              254.86
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -259.41,
              10.11,
              110.38
            ],
            [
              -387.15,
              10.11,
              184.13
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -496.88,
              11.9,
              195.35
            ],
            [
              -506.55,
              48.81,
              192.95
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3001",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              344.83,
              10.11,
              -36.05
            ],
            [
              544.8,
              22.52,
              -33.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3002",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              557.24,
              10.11,
              99.12
            ],
            [
              558.04,
              9.65,
              405.84
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3003",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              525.43,
              10.11,
              419.27
            ],
            [
              334.2,
              9.69,
              432.04
            ]
          ],
          "loopBehavior": "loop"
        }
      }
    ],
    "collectibles": {
      "chests": [
        {
          "id": "chest_86",
          "position": [
            71.16420118627303,
            -5,
            -201.56424490030776
          ],
          "contents": "potion"
        },
        {
          "id": "chest_87",
          "position": [
            5.770222437023225,
            6.4443113803863525,
            -92.42821318120475
          ],
          "contents": "llm_gpt"
        },
        {
          "id": "chest_88",
          "position": [
            189.01635770772984,
            0.8330993056297311,
            -95.5022284937324
          ],
          "contents": "llm_claude"
        },
        {
          "id": "chest_97",
          "position": [
            92.82467252921622,
            0.7183278165757656,
            68.85705878163222
          ],
          "contents": "llm_gemini"
        },
        {
          "id": "chest_98",
          "position": [
            84.65530251343915,
            6.940662171029872,
            -6.231125135330858
          ],
          "contents": "potion"
        },
        {
          "id": "chest_99",
          "position": [
            64.63794991764622,
            0.7099524576481729,
            -74.90677745355819
          ],
          "contents": "potion"
        },
        {
          "id": "chest_100",
          "position": [
            -20.165968969240608,
            -5.921493202447892,
            -179.7076945282295
          ],
          "contents": "potion"
        }
      ],
      "apples": [],
      "potions": [],
      "llm_gpt": [],
      "llm_claude": [],
      "llm_gemini": []
    }
  },
  {
    "id": "level1_glitched",
    "name": "GLITCHED: Level 1",
    "gltfUrl": "assets/levels/revamped/Level1.gltf",
    "startPosition": [
      0,
      12,
      0
    ],
    "lights": [
      {
        "key": "TechLights",
        "props": {
          "position": [
            0,
            0,
            0
          ]
        }
      },
      {
        "key": "BasicLights",
        "props": {
          "intensity": 0.6
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [
            0,
            22,
            0
          ],
          "color": 8965375,
          "intensity": 3,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [
            0,
            22,
            -25
          ],
          "color": 8965375,
          "intensity": 2.5,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            12.912955239766767,
            37.88715128438456,
            -0.6576220834419964
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.5,
          "length": 18
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            12.944228948310343,
            36.3885593052973,
            -0.7342901183469568
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.6,
          "length": 16,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.771536745930266,
            37.10794565203993,
            -0.2786261734922153
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.45,
          "length": 20,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.786166101517708,
            35.637551218443186,
            0.09513458030733979
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.55,
          "length": 17,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            11.918973319923648,
            32.82629147937733,
            -0.5821365533665996
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.7,
          "length": 15,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -12.380822352048272,
            32.98950836127626,
            0.30395344141215386
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.4,
          "length": 22,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -7.066101073891365,
            39.086951601572,
            -1.202468494343286
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.65,
          "length": 19,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            -7.654338940706618,
            39.1165865627044,
            0.7016923973175011
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.52,
          "length": 21,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            7.062490970189732,
            38.89875358023083,
            -1.4657143172867606
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.48,
          "length": 17.5,
          "branches": 5
        }
      },
      {
        "key": "RedLightning",
        "props": {
          "position": [
            6.6347481289407355,
            38.869158640436886,
            1.324692383072716
          ],
          "color": 65535,
          "intensity": 4.5,
          "strikeFrequency": 0.58,
          "length": 19.5,
          "branches": 5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.13807616959711,
            19.463404294493557,
            -25.823032754301256
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.16909747940394,
            19.463404294493557,
            -27.13562457148415
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.19859913312111,
            19.463404294493557,
            -28.453574585960094
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.14985223550229,
            19.463404294493557,
            -29.66304109539178
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.24519648095297,
            19.463404294493557,
            -31.030929245129776
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.23451972231483,
            19.463404294493557,
            -32.12921366927179
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            37.20699800401285,
            19.463404294493557,
            -33.31666531646326
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.56784082247674,
            19.463404294493557,
            -26.342960488002813
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.608876255091346,
            19.463404294493557,
            -27.791121946094922
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.651721009570444,
            19.463404294493557,
            -29.038673863085236
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.821846110202166,
            19.463404294493557,
            -30.411332975256368
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.79240656912321,
            19.463404294493557,
            -31.410144903763197
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.98665721682491,
            19.463404294493557,
            -32.763087823485215
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      },
      {
        "key": "BinaryShader",
        "props": {
          "position": [
            -37.77547883082075,
            19.463404294493557,
            -33.87862076073715
          ],
          "width": 4,
          "height": 10,
          "color": 54527,
          "speed": 7,
          "density": 12,
          "brightness": 3,
          "fallStrength": 0.5
        }
      }
    ],
    "ui": [
      "hud",
      {
        "type": "minimap",
        "config": {
          "zoom": 1.6
        }
      },
      {
        "type": "collectibles",
        "config": {
          "applesTotal": 7,
          "potionsStart": 5,
          "pointsPerApple": 200,
          "collectibleTypes": {
            "apples": {
              "icon": "🍏",
              "name": "Green Apples",
              "color": "#51cf66",
              "completeColor": "#ffd43b",
              "completeIcon": "👑"
            },
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#9775fa",
              "lowColor": "#ffd43b",
              "emptyColor": "#ff6b6b",
              "emptyIcon": "💔"
            }
          }
        }
      }
    ],
    "enemies": [
      {
        "type": "crawler",
        "position": [
          -425.5900434110422,
          20.113008499145508,
          274.669088469345
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 29
      },
      {
        "type": "crawler",
        "position": [
          -433.3701164361692,
          20.113008499145515,
          257.2399163600309
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 30
      },
      {
        "type": "crawler",
        "position": [
          -426.66473887928464,
          20.113008499145515,
          244.20925144592724
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 31
      },
      {
        "type": "crawler",
        "position": [
          305.7826403923883,
          20.027040152890915,
          24.799900322963577
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 48
      },
      {
        "type": "crawler",
        "position": [
          287.3535217944027,
          20.95949363708496,
          25.74999179342933
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 49
      },
      {
        "type": "crawler",
        "position": [
          310.305134317053,
          20.452826949471497,
          122.30921272529777
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 50
      },
      {
        "type": "crawler",
        "position": [
          291.14432266074226,
          20.509656195663787,
          121.99517109242474
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 51
      },
      {
        "type": "crawler",
        "position": [
          319.51625700361103,
          20.486056737854557,
          274.04694288437554
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 52
      },
      {
        "type": "crawler",
        "position": [
          274.64077936042764,
          20.741729019436846,
          277.2949816103393
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 53
      }
    ],
    "npcs": [
      {
        "type": "yellow_bot",
        "position": [
          6.350443774254943,
          9.439203262329102,
          -25.949882425660608
        ],
        "modelUrl": "assets/npc/yellow_bot/scene.gltf",
        "patrolPoints": [],
        "speed": 2,
        "scale": 10,
        "chaseRange": 0,
        "id": 2
      },
      {
        "type": "other_bot",
        "position": [
          13.563743283481266,
          11.439203262329102,
          -35.625234114583954
        ],
        "modelUrl": "assets/npc/other_bot/Mike.gltf",
        "patrolPoints": [],
        "speed": 2,
        "scale": 1,
        "chaseRange": 0,
        "id": 3
      }
    ],
    "platforms": [],
    "interactiveObjects": [
      {
        "id": "interactive_3",
        "objectType": "pressurePlate",
        "position": [
          -493.6651629419319,
          10.113008499145508,
          292.94097499910407
        ],
        "size": 10,
        "activationWeight": 40,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_4",
        "objectType": "pressurePlate",
        "position": [
          -494.145160650115,
          10.113008499145508,
          267.5963964375436
        ],
        "size": 10,
        "activationWeight": 10,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_5",
        "objectType": "pressurePlate",
        "position": [
          -493.6658502474449,
          10.113008499145508,
          247.13187696380177
        ],
        "size": 10,
        "activationWeight": 40,
        "pressedHeight": -0.1,
        "color": 65280
      }
    ],
    "triggers": [],
    "meshAnimations": [
      {
        "meshName": "Lift2",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -225.86,
              10.11,
              124.18
            ],
            [
              -229.68,
              9.65,
              254.86
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -259.41,
              10.11,
              110.38
            ],
            [
              -387.15,
              10.11,
              184.13
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -496.88,
              11.9,
              195.35
            ],
            [
              -506.55,
              48.81,
              192.95
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3001",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              344.83,
              10.11,
              -36.05
            ],
            [
              544.8,
              22.52,
              -33.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3002",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              557.24,
              10.11,
              99.12
            ],
            [
              558.04,
              9.65,
              405.84
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3003",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              525.43,
              10.11,
              419.27
            ],
            [
              334.2,
              9.69,
              432.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "TreeNode2",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      },
      {
        "meshName": "TreeNode1",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      }
    ],
    "colliders": [
      {
        "id": "collider_2",
        "type": "box",
        "position": [
          0,
          8.439203262329102,
          -10.976917266845703
        ],
        "size": [
          74.21695709228516,
          2.000000033833089,
          74.21695709228516
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_3",
        "type": "box",
        "position": [
          0,
          23.242176055908203,
          -1.9201059341430664
        ],
        "size": [
          2,
          10.32878589630127,
          2
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_4",
        "type": "box",
        "position": [
          0,
          27.362017565243946,
          -2.9135963916778564
        ],
        "size": [
          20.964557647705078,
          35.83751362866792,
          10.630075931549072
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "wall"
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "Walls",
        "materialType": "wall",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Platform",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Platform2",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Platform8",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform4",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_13",
        "type": "mesh",
        "meshName": "Lift2",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_14",
        "type": "mesh",
        "meshName": "Lift3",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "mesh",
        "meshName": "Platform5",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "mesh",
        "meshName": "Leaf",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "mesh",
        "meshName": "Lift",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "mesh",
        "meshName": "Platform7",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "mesh",
        "meshName": "Elevated_Ground",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_2",
        "type": "mesh",
        "meshName": "Platform001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_3",
        "type": "mesh",
        "meshName": "Platform002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_4",
        "type": "mesh",
        "meshName": "Platform3002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "Cube",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Lift3001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform4001",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform3003",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Lift3002",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3004",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Lift3003",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform3006",
        "materialType": "ground",
        "rotation": [
          0,
          0,
          0
        ]
      }
    ],
    "placeableBlocks": [
      {
        "id": "block_2",
        "type": "placeableBlock",
        "color": 16729156,
        "colorName": "red",
        "position": [
          -452.98549867511366,
          31,
          278.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -452.98549867511366,
          40,
          278.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      },
      {
        "id": "block_3",
        "type": "placeableBlock",
        "color": 6448255,
        "colorName": "blue",
        "position": [
          -438.98549867511366,
          31,
          252.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -438.98549867511366,
          40,
          252.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      },
      {
        "id": "block_4",
        "type": "placeableBlock",
        "color": 43520,
        "colorName": "green",
        "position": [
          -456.98549867511366,
          31,
          265.80619239726207
        ],
        "size": [
          5,
          5,
          5
        ],
        "mass": 61,
        "respawn": true,
        "respawnTime": 60.5,
        "spawnPosition": [
          -456.98549867511366,
          40,
          265.80619239726207
        ],
        "collider": {
          "type": "box",
          "size": [
            5,
            5,
            5
          ],
          "materialType": "ground"
        }
      }
    ],
    "collectibles": {
      "chests": [
        {
          "id": "chest_32",
          "position": [
            -499.085311265958,
            38.74439334869385,
            334.06633057575175
          ],
          "contents": "apple"
        },
        {
          "id": "chest_33",
          "position": [
            -225.62864531854856,
            9.651255130767824,
            278.7988147172013
          ],
          "contents": "apple"
        },
        {
          "id": "chest_34",
          "position": [
            -237.44661100161906,
            23.226380348205566,
            -17.687950706826655
          ],
          "contents": "apple"
        },
        {
          "id": "chest_35",
          "position": [
            -238.27040579662082,
            23.226380348205566,
            -23.327350349487794
          ],
          "contents": "potion"
        },
        {
          "id": "chest_37",
          "position": [
            -237.8768482421618,
            23.226380348205566,
            -30.485315919861755
          ],
          "contents": "potion"
        },
        {
          "id": "chest_38",
          "position": [
            -169.3996665850923,
            9.651255130767822,
            -82.64101963921365
          ],
          "contents": "apple"
        },
        {
          "id": "chest_39",
          "position": [
            -26.238882996084904,
            9.439203262329102,
            -44.85368840875811
          ],
          "contents": "apple"
        },
        {
          "id": "chest_40",
          "position": [
            27.87669681671055,
            9.439203262329102,
            -45.742070533768135
          ],
          "contents": "apple"
        },
        {
          "id": "chest_41",
          "position": [
            563.1453318104104,
            23.226380348205566,
            46.48808928837561
          ],
          "contents": "potion"
        },
        {
          "id": "chest_42",
          "position": [
            567.1970196438438,
            9.651255130767822,
            429.1261757803478
          ],
          "contents": "potion"
        },
        {
          "id": "chest_43",
          "position": [
            317.9556895504127,
            9.691577911376953,
            402.88531324057374
          ],
          "contents": "potion"
        },
        {
          "id": "chest_44",
          "position": [
            274.4610301937911,
            9.691577911376955,
            406.2805544583855
          ],
          "contents": "potion"
        },
        {
          "id": "chest_45",
          "position": [
            272.8105836219984,
            9.691577911376951,
            417.24719695393435
          ],
          "contents": "potion"
        },
        {
          "id": "chest_46",
          "position": [
            319.2518496027569,
            9.691577911376955,
            417.44962917460015
          ],
          "contents": "apple"
        },
        {
          "id": "chest_47",
          "position": [
            275.60067626746354,
            9.691577911376953,
            -62.93518485094077
          ],
          "contents": "potion"
        }
      ],
      "potions": [],
      "coins": [],
      "gems": [],
      "keys": []
    }
  },
  {
    "id": "level2_glitched",
    "name": "GLITCHED: Level 2",
    "gltfUrl": "assets/levels/Level2/Level2.gltf",
    "startPosition": [
      195,
      6,
      -83
    ],
    "ui": [
      "hud",
      {
        "type": "minimap",
        "config": {
          "zoom": 1.6
        }
      },
      {
        "type": "collectibles",
        "config": {
          "applesTotal": 2,
          "potionsStart": 5,
          "pointsPerApple": 200,
          "collectibleTypes": {
            "apples": {
              "icon": "🖥️",
              "name": "Assets",
              "color": "#51cf66",
              "completeColor": "#ffd43b",
              "completeIcon": "👑"
            },
            "potions": {
              "icon": "🧪",
              "name": "Health Potions",
              "color": "#9775fa",
              "lowColor": "#ffd43b",
              "emptyColor": "#ff6b6b",
              "emptyIcon": "💔"
            }
          }
        }
      }
    ],
    "colliders": [
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          195.56,
          0.16,
          -81.19
        ],
        "size": [
          23.3,
          0.1,
          29.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          195.28,
          0.16,
          -46.68
        ],
        "size": [
          8.7,
          0.1,
          39.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          176.17,
          0.16,
          -30.92
        ],
        "size": [
          29.5,
          0.1,
          9.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          141.24,
          0.16,
          -29.35
        ],
        "size": [
          40.3,
          0.1,
          41.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          147.94,
          0.12,
          30.85
        ],
        "size": [
          40.3,
          0.1,
          41
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          140.28,
          0.16,
          0.82
        ],
        "size": [
          10,
          0.1,
          19
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          120.78,
          0.16,
          0.71
        ],
        "size": [
          29.1,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          166.43,
          0.16,
          0.71
        ],
        "size": [
          42.3,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          202.09,
          0.14,
          19.4
        ],
        "size": [
          45.5,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          183.58,
          0.16,
          10.01
        ],
        "size": [
          9.4,
          0.1,
          10.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          220.77,
          0.16,
          5.92
        ],
        "size": [
          9,
          0.1,
          18.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_65",
        "type": "box",
        "position": [
          234.22,
          0.16,
          1.01
        ],
        "size": [
          17.9,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_66",
        "type": "box",
        "position": [
          182.49,
          0.16,
          37.8
        ],
        "size": [
          28.8,
          0.1,
          8.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_67",
        "type": "box",
        "position": [
          201.56,
          0.16,
          37.83
        ],
        "size": [
          9.3,
          0.1,
          28.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_68",
        "type": "box",
        "position": [
          197.8,
          0.16,
          56.49
        ],
        "size": [
          53.6,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_69",
        "type": "box",
        "position": [
          239.05,
          0.16,
          42.11
        ],
        "size": [
          9,
          0.1,
          73.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_70",
        "type": "box",
        "position": [
          216.35,
          0.16,
          75.37
        ],
        "size": [
          36.5,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_71",
        "type": "box",
        "position": [
          220.63,
          0.14,
          65.92
        ],
        "size": [
          9.5,
          0.1,
          9.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          201.88,
          0.22,
          84.35
        ],
        "size": [
          9,
          0.1,
          9.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          179.48,
          0.23,
          93.31
        ],
        "size": [
          53.3,
          0.1,
          8.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          156.61,
          0.23,
          80.1
        ],
        "size": [
          9,
          0.1,
          17.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          170.2,
          0.21,
          75
        ],
        "size": [
          18.2,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          174.8,
          0.23,
          66.01
        ],
        "size": [
          9,
          0.1,
          9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          85.56,
          0.16,
          -1.19
        ],
        "size": [
          41.4,
          0.1,
          24.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          101.97,
          0.16,
          -30.91
        ],
        "size": [
          38.2,
          0.1,
          8.1
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          87.18,
          0.13,
          -20.24
        ],
        "size": [
          8.5,
          0.1,
          13.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          60.73,
          0.16,
          -9.4
        ],
        "size": [
          8.4,
          0.1,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_41",
        "type": "box",
        "position": [
          27.53,
          0.16,
          -30.07
        ],
        "size": [
          58,
          0.1,
          49.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_42",
        "type": "box",
        "position": [
          108.84,
          0.12,
          75.95
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_43",
        "type": "box",
        "position": [
          45.12,
          0.12,
          123.13
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_44",
        "type": "box",
        "position": [
          125.69,
          0.12,
          125.06
        ],
        "size": [
          23.9,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_45",
        "type": "box",
        "position": [
          85.39,
          0.12,
          125
        ],
        "size": [
          40.5,
          0.1,
          24.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_46",
        "type": "box",
        "position": [
          109.64,
          0.12,
          116.75
        ],
        "size": [
          8.1,
          0.1,
          8.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_47",
        "type": "box",
        "position": [
          61.1,
          0.12,
          116.8
        ],
        "size": [
          8.1,
          0.1,
          8.3
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_48",
        "type": "box",
        "position": [
          92.8,
          0.12,
          162.33
        ],
        "size": [
          40.4,
          0.1,
          24.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_49",
        "type": "box",
        "position": [
          0.51,
          0.12,
          176.77
        ],
        "size": [
          40.4,
          0.1,
          22.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_50",
        "type": "box",
        "position": [
          46.63,
          0.16,
          169.52
        ],
        "size": [
          51.9,
          0.2,
          8.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_51",
        "type": "box",
        "position": [
          38.39,
          0.16,
          150.49
        ],
        "size": [
          8.2,
          0.1,
          29.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_52",
        "type": "box",
        "position": [
          26,
          0.16,
          33.28
        ],
        "size": [
          8.4,
          0.2,
          77.7
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_53",
        "type": "box",
        "position": [
          44.49,
          0.16,
          39.18
        ],
        "size": [
          8.3,
          0.1,
          45.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_54",
        "type": "box",
        "position": [
          35.24,
          0.16,
          39.14
        ],
        "size": [
          10.2,
          0.1,
          8.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_55",
        "type": "box",
        "position": [
          87.27,
          0.16,
          17.86
        ],
        "size": [
          9,
          0.1,
          13.5
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_56",
        "type": "box",
        "position": [
          65.73,
          0.16,
          20.5
        ],
        "size": [
          34.1,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_57",
        "type": "box",
        "position": [
          90.22,
          0.16,
          76.49
        ],
        "size": [
          13.5,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_58",
        "type": "box",
        "position": [
          70.12,
          0.16,
          57.64
        ],
        "size": [
          43.1,
          0.1,
          8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_59",
        "type": "box",
        "position": [
          87.45,
          0.16,
          67.04
        ],
        "size": [
          8.6,
          0.1,
          10.9
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_60",
        "type": "box",
        "position": [
          87.98,
          0.16,
          96.59
        ],
        "size": [
          9,
          0.1,
          32.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_61",
        "type": "box",
        "position": [
          50.84,
          0.16,
          91.8
        ],
        "size": [
          8.6,
          0.1,
          37.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_62",
        "type": "box",
        "position": [
          64.14,
          0.16,
          76.81
        ],
        "size": [
          17.9,
          0.1,
          8.4
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_63",
        "type": "box",
        "position": [
          69.07,
          0.16,
          90.1
        ],
        "size": [
          8.3,
          0.1,
          18.2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_64",
        "type": "box",
        "position": [
          78.41,
          0.15,
          95.02
        ],
        "size": [
          10.3,
          0.1,
          8.8
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7000",
        "type": "box",
        "position": [
          188.52,
          3,
          -66.49
        ],
        "size": [
          9.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7001",
        "type": "box",
        "position": [
          202.62,
          3.1,
          -66.49
        ],
        "size": [
          9.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7002",
        "type": "box",
        "position": [
          195.56,
          3,
          -95.89
        ],
        "size": [
          23.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7003",
        "type": "box",
        "position": [
          207.21,
          3,
          -81.19
        ],
        "size": [
          0.5,
          6,
          29.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7004",
        "type": "box",
        "position": [
          183.91,
          3,
          -81.19
        ],
        "size": [
          0.5,
          6,
          29.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7005",
        "type": "box",
        "position": [
          195.28,
          3,
          -26.88
        ],
        "size": [
          8.7,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7006",
        "type": "box",
        "position": [
          199.63,
          3,
          -46.68
        ],
        "size": [
          0.5,
          6,
          39.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7007",
        "type": "box",
        "position": [
          190.93,
          3,
          -51.025000000000006
        ],
        "size": [
          0.5,
          6,
          30.910000000000004
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7008",
        "type": "box",
        "position": [
          176.17,
          3,
          -26.270000000000003
        ],
        "size": [
          29.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7009",
        "type": "box",
        "position": [
          176.17,
          3,
          -35.57
        ],
        "size": [
          29.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7010",
        "type": "box",
        "position": [
          129.89,
          3,
          -8.65
        ],
        "size": [
          15.8,
          6,
          0.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7011",
        "type": "box",
        "position": [
          151.54,
          3,
          -8.65
        ],
        "size": [
          18.4,
          6,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7012",
        "type": "box",
        "position": [
          141.24,
          3,
          -50.05
        ],
        "size": [
          40.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7013",
        "type": "box",
        "position": [
          161.39000000000001,
          3,
          -42.81
        ],
        "size": [
          0.5,
          6,
          14.479999999999997
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7014",
        "type": "box",
        "position": [
          161.39000000000001,
          3,
          -17.46
        ],
        "size": [
          0.5,
          6,
          17.62
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7015",
        "type": "box",
        "position": [
          121.09,
          3,
          -41
        ],
        "size": [
          1,
          6,
          16
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7016",
        "type": "box",
        "position": [
          121.09,
          3,
          -19.06
        ],
        "size": [
          1,
          6,
          19
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7017",
        "type": "box",
        "position": [
          147.94,
          3,
          51.35
        ],
        "size": [
          40.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7018",
        "type": "box",
        "position": [
          133.33,
          3,
          10.35
        ],
        "size": [
          9,
          6,
          2.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7019",
        "type": "box",
        "position": [
          154.69,
          3,
          10.35
        ],
        "size": [
          24.810000000000002,
          6,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7020",
        "type": "box",
        "position": [
          168.09,
          3,
          23.13
        ],
        "size": [
          1.6,
          6,
          24.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7021",
        "type": "box",
        "position": [
          168.09,
          3,
          45.22
        ],
        "size": [
          1.6,
          6,
          10.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7022",
        "type": "box",
        "position": [
          127.78999999999999,
          3,
          30.85
        ],
        "size": [
          0.5,
          6,
          41
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7023",
        "type": "box",
        "position": [
          145.28,
          3,
          -6.035
        ],
        "size": [
          0.5,
          6,
          5.29
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7024",
        "type": "box",
        "position": [
          145.28,
          3,
          7.5649999999999995
        ],
        "size": [
          0.5,
          6,
          5.510000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7025",
        "type": "box",
        "position": [
          135.28,
          3,
          -6.035
        ],
        "size": [
          0.5,
          6,
          5.29
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7026",
        "type": "box",
        "position": [
          135.28,
          3,
          7.5649999999999995
        ],
        "size": [
          0.5,
          6,
          5.510000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7027",
        "type": "box",
        "position": [
          120.78,
          3,
          4.81
        ],
        "size": [
          29.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7028",
        "type": "box",
        "position": [
          120.78,
          3,
          -3.3899999999999997
        ],
        "size": [
          29.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7029",
        "type": "box",
        "position": [
          162.08,
          3,
          4.81
        ],
        "size": [
          33.60000000000002,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7030",
        "type": "box",
        "position": [
          166.43,
          3,
          -3.3899999999999997
        ],
        "size": [
          42.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7031",
        "type": "box",
        "position": [
          187.58,
          3,
          0.71
        ],
        "size": [
          0.5,
          6,
          8.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7032",
        "type": "box",
        "position": [
          188.125,
          3,
          23.7
        ],
        "size": [
          17.569999999999993,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7033",
        "type": "box",
        "position": [
          215.525,
          3,
          23.7
        ],
        "size": [
          18.629999999999995,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7034",
        "type": "box",
        "position": [
          202.275,
          3,
          15.099999999999998
        ],
        "size": [
          27.99000000000001,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7035",
        "type": "box",
        "position": [
          224.84,
          3,
          19.4
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7036",
        "type": "box",
        "position": [
          179.34,
          3,
          19.4
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7037",
        "type": "box",
        "position": [
          188.28,
          3,
          10.01
        ],
        "size": [
          0.5,
          6,
          10.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7038",
        "type": "box",
        "position": [
          178.88000000000002,
          3,
          10.01
        ],
        "size": [
          0.5,
          6,
          10.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7039",
        "type": "box",
        "position": [
          220.77,
          3,
          -3.2799999999999994
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7040",
        "type": "box",
        "position": [
          225.27,
          3,
          10.215
        ],
        "size": [
          0.5,
          6,
          9.809999999999999
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7041",
        "type": "box",
        "position": [
          216.27,
          3,
          5.92
        ],
        "size": [
          0.5,
          6,
          18.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7042",
        "type": "box",
        "position": [
          229.91000000000003,
          3,
          5.31
        ],
        "size": [
          9.280000000000001,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7043",
        "type": "box",
        "position": [
          234.22,
          3,
          -3.29
        ],
        "size": [
          17.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7044",
        "type": "box",
        "position": [
          243.17,
          3,
          1.01
        ],
        "size": [
          0.5,
          6,
          8.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7045",
        "type": "box",
        "position": [
          182.49,
          3,
          42.099999999999994
        ],
        "size": [
          28.8,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7046",
        "type": "box",
        "position": [
          182.49,
          3,
          33.5
        ],
        "size": [
          28.8,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7047",
        "type": "box",
        "position": [
          206.21,
          3,
          37.83
        ],
        "size": [
          0.5,
          6,
          28.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7048",
        "type": "box",
        "position": [
          196.91,
          3,
          28.59
        ],
        "size": [
          0.5,
          6,
          9.82
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7049",
        "type": "box",
        "position": [
          196.91,
          3,
          47.03999999999999
        ],
        "size": [
          0.5,
          6,
          9.880000000000003
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7050",
        "type": "box",
        "position": [
          197.59,
          3,
          60.99
        ],
        "size": [
          36.579999999999984,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7051",
        "type": "box",
        "position": [
          183.95499999999998,
          3,
          51.99
        ],
        "size": [
          25.909999999999997,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7052",
        "type": "box",
        "position": [
          215.40500000000003,
          3,
          51.99
        ],
        "size": [
          18.390000000000015,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7053",
        "type": "box",
        "position": [
          224.60000000000002,
          3,
          56.49
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7054",
        "type": "box",
        "position": [
          171,
          3,
          56.49
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7055",
        "type": "box",
        "position": [
          239.05,
          3,
          78.91
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7056",
        "type": "box",
        "position": [
          243.55,
          3,
          42.11
        ],
        "size": [
          0.5,
          6,
          73.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7057",
        "type": "box",
        "position": [
          234.55,
          3,
          38.09
        ],
        "size": [
          0.5,
          6,
          65.56
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7058",
        "type": "box",
        "position": [
          220.49,
          3,
          79.87
        ],
        "size": [
          28.22,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7059",
        "type": "box",
        "position": [
          206.99,
          3,
          70.87
        ],
        "size": [
          17.78,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7060",
        "type": "box",
        "position": [
          229.99,
          3,
          70.87
        ],
        "size": [
          9.219999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7061",
        "type": "box",
        "position": [
          198.1,
          3,
          75.37
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7062",
        "type": "box",
        "position": [
          225.38,
          3,
          65.92
        ],
        "size": [
          0.5,
          6,
          9.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7063",
        "type": "box",
        "position": [
          215.88,
          3,
          65.92
        ],
        "size": [
          0.5,
          6,
          9.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7064",
        "type": "box",
        "position": [
          206.38,
          3,
          84.35
        ],
        "size": [
          0.5,
          6,
          9.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7065",
        "type": "box",
        "position": [
          197.38,
          3,
          84.35
        ],
        "size": [
          0.5,
          6,
          9.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7066",
        "type": "box",
        "position": [
          179.48,
          3,
          97.66
        ],
        "size": [
          53.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7067",
        "type": "box",
        "position": [
          179.245,
          3,
          88.96000000000001
        ],
        "size": [
          36.26999999999998,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7068",
        "type": "box",
        "position": [
          206.13,
          3,
          93.31
        ],
        "size": [
          0.5,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7069",
        "type": "box",
        "position": [
          152.82999999999998,
          3,
          93.31
        ],
        "size": [
          0.5,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7070",
        "type": "box",
        "position": [
          156.61,
          3,
          71.25
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7071",
        "type": "box",
        "position": [
          161.11,
          3,
          84.225
        ],
        "size": [
          0.5,
          6,
          9.449999999999989
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7072",
        "type": "box",
        "position": [
          152.11,
          3,
          80.1
        ],
        "size": [
          0.5,
          6,
          17.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7073",
        "type": "box",
        "position": [
          170.2,
          3,
          79.5
        ],
        "size": [
          18.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7074",
        "type": "box",
        "position": [
          165.7,
          3,
          70.5
        ],
        "size": [
          9.200000000000017,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7075",
        "type": "box",
        "position": [
          179.29999999999998,
          3,
          75
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7076",
        "type": "box",
        "position": [
          179.3,
          3,
          66.01
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7077",
        "type": "box",
        "position": [
          170.3,
          3,
          66.01
        ],
        "size": [
          0.5,
          6,
          9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7078",
        "type": "box",
        "position": [
          75.41,
          3,
          10.66
        ],
        "size": [
          20,
          6,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7079",
        "type": "box",
        "position": [
          97.72,
          3,
          10.86
        ],
        "size": [
          16,
          6,
          1.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7080",
        "type": "box",
        "position": [
          71.3,
          3,
          -13.54
        ],
        "size": [
          27,
          6,
          1.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7081",
        "type": "box",
        "position": [
          97.04,
          3,
          -13.24
        ],
        "size": [
          15.3,
          6,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7082",
        "type": "box",
        "position": [
          106.26,
          3,
          -7.66
        ],
        "size": [
          1.4,
          6,
          12.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7083",
        "type": "box",
        "position": [
          106.26,
          3,
          6.78
        ],
        "size": [
          1.5,
          6,
          7.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7084",
        "type": "box",
        "position": [
          64.86,
          3,
          2.9299999999999997
        ],
        "size": [
          0.5,
          6,
          16.46
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7085",
        "type": "box",
        "position": [
          106.25,
          3,
          -26.86
        ],
        "size": [
          29.639999999999986,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7086",
        "type": "box",
        "position": [
          101.97,
          3,
          -34.96
        ],
        "size": [
          38.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7087",
        "type": "box",
        "position": [
          82.87,
          3,
          -30.91
        ],
        "size": [
          0.5,
          6,
          8.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7088",
        "type": "box",
        "position": [
          91.43,
          3,
          -20.24
        ],
        "size": [
          0.5,
          6,
          13.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7089",
        "type": "box",
        "position": [
          82.93,
          3,
          -20.24
        ],
        "size": [
          0.5,
          6,
          13.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7090",
        "type": "box",
        "position": [
          60.73,
          3,
          -5.300000000000001
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7091",
        "type": "box",
        "position": [
          60.73,
          3,
          -13.5
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7092",
        "type": "box",
        "position": [
          10.17,
          7.7,
          -5.22
        ],
        "size": [
          23.27,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7093",
        "type": "box",
        "position": [
          43.37,
          7.7,
          -5.22
        ],
        "size": [
          26.330000000000002,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7094",
        "type": "box",
        "position": [
          27.53,
          7.7,
          -54.92
        ],
        "size": [
          58,
          15.2,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7095",
        "type": "box",
        "position": [
          56.53,
          7.7,
          -34.21
        ],
        "size": [
          0.5,
          15.2,
          41.42
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7096",
        "type": "box",
        "position": [
          -1.47,
          7.7,
          -30.07
        ],
        "size": [
          0.5,
          15.2,
          49.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7097",
        "type": "box",
        "position": [
          108.84,
          3,
          88.35000000000001
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7098",
        "type": "box",
        "position": [
          108.84,
          3,
          63.550000000000004
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7099",
        "type": "box",
        "position": [
          120.79,
          3,
          75.95
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7100",
        "type": "box",
        "position": [
          96.89,
          3,
          69.42
        ],
        "size": [
          1.6,
          6,
          9.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7101",
        "type": "box",
        "position": [
          96.89,
          3,
          83.02
        ],
        "size": [
          1.6,
          6,
          8.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7102",
        "type": "box",
        "position": [
          33.730000000000004,
          3,
          135.53
        ],
        "size": [
          1.1199999999999974,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7103",
        "type": "box",
        "position": [
          49.78,
          3,
          135.53
        ],
        "size": [
          14.579999999999991,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7104",
        "type": "box",
        "position": [
          39.855000000000004,
          3,
          110.72999999999999
        ],
        "size": [
          13.370000000000005,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7105",
        "type": "box",
        "position": [
          56.105,
          3,
          110.72999999999999
        ],
        "size": [
          1.9299999999999926,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7106",
        "type": "box",
        "position": [
          57.06999999999999,
          3,
          111.69
        ],
        "size": [
          0.5,
          6,
          1.9200000000000017
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7107",
        "type": "box",
        "position": [
          57.06999999999999,
          3,
          128.24
        ],
        "size": [
          0.5,
          6,
          14.579999999999998
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7108",
        "type": "box",
        "position": [
          33.17,
          3,
          123.13
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7109",
        "type": "box",
        "position": [
          125.69,
          3,
          137.46
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7110",
        "type": "box",
        "position": [
          125.69,
          3,
          112.66
        ],
        "size": [
          23.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7111",
        "type": "box",
        "position": [
          137.64,
          3,
          125.06
        ],
        "size": [
          0.5,
          6,
          24.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7112",
        "type": "box",
        "position": [
          113.74,
          3,
          129.18
        ],
        "size": [
          0.5,
          6,
          16.560000000000002
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7113",
        "type": "box",
        "position": [
          85.39,
          3,
          137.4
        ],
        "size": [
          40.5,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7114",
        "type": "box",
        "position": [
          74.31,
          3,
          112.6
        ],
        "size": [
          18.340000000000003,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7115",
        "type": "box",
        "position": [
          99.06,
          3,
          112.6
        ],
        "size": [
          13.159999999999997,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7116",
        "type": "box",
        "position": [
          105.64,
          3,
          129.15
        ],
        "size": [
          0.5,
          6,
          16.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7117",
        "type": "box",
        "position": [
          65.14,
          3,
          129.175
        ],
        "size": [
          0.5,
          6,
          16.450000000000003
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7118",
        "type": "box",
        "position": [
          109.64,
          3,
          120.9
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7119",
        "type": "box",
        "position": [
          109.64,
          3,
          112.6
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7120",
        "type": "box",
        "position": [
          61.1,
          3,
          120.95
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7121",
        "type": "box",
        "position": [
          61.1,
          3,
          112.64999999999999
        ],
        "size": [
          8.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7122",
        "type": "box",
        "position": [
          92.8,
          3,
          174.78
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7123",
        "type": "box",
        "position": [
          92.8,
          3,
          149.88000000000002
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7124",
        "type": "box",
        "position": [
          113,
          3,
          162.33
        ],
        "size": [
          0.5,
          6,
          24.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7125",
        "type": "box",
        "position": [
          72.6,
          3,
          158.95
        ],
        "size": [
          1.6,
          6,
          17
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7126",
        "type": "box",
        "position": [
          72.6,
          3,
          174.2
        ],
        "size": [
          0.5,
          6,
          1.1599999999999966
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7127",
        "type": "box",
        "position": [
          0.51,
          3,
          188.92
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7128",
        "type": "box",
        "position": [
          0.51,
          3,
          164.62
        ],
        "size": [
          40.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7129",
        "type": "box",
        "position": [
          20.71,
          3,
          176.22
        ],
        "size": [
          1.6,
          6,
          9.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7130",
        "type": "box",
        "position": [
          20.71,
          3,
          184.47
        ],
        "size": [
          0.5,
          6,
          8.099999999999994
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7131",
        "type": "box",
        "position": [
          -19.39,
          3,
          176.17
        ],
        "size": [
          0.5,
          6,
          24.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7132",
        "type": "box",
        "position": [
          46.63,
          3,
          173.62
        ],
        "size": [
          51.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7133",
        "type": "box",
        "position": [
          27.485,
          3,
          165.42000000000002
        ],
        "size": [
          13.609999999999996,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7134",
        "type": "box",
        "position": [
          57.535,
          3,
          165.42000000000002
        ],
        "size": [
          30.089999999999996,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7135",
        "type": "box",
        "position": [
          42.49,
          3,
          150.49
        ],
        "size": [
          0.5,
          6,
          29.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7136",
        "type": "box",
        "position": [
          34.29,
          3,
          150.49
        ],
        "size": [
          0.5,
          6,
          29.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7137",
        "type": "box",
        "position": [
          26,
          3,
          72.13
        ],
        "size": [
          8.4,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7138",
        "type": "box",
        "position": [
          30.2,
          3,
          14.559999999999999
        ],
        "size": [
          0.5,
          6,
          40.26
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7139",
        "type": "box",
        "position": [
          30.2,
          3,
          57.86
        ],
        "size": [
          0.5,
          6,
          28.539999999999992
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7140",
        "type": "box",
        "position": [
          21.8,
          3,
          33.28
        ],
        "size": [
          0.5,
          6,
          77.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7141",
        "type": "box",
        "position": [
          44.49,
          3,
          61.879999999999995
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7142",
        "type": "box",
        "position": [
          44.49,
          3,
          16.48
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7143",
        "type": "box",
        "position": [
          48.64,
          3,
          39.07
        ],
        "size": [
          0.5,
          6,
          29.14
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7144",
        "type": "box",
        "position": [
          40.34,
          3,
          25.585
        ],
        "size": [
          0.5,
          6,
          18.209999999999997
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7145",
        "type": "box",
        "position": [
          40.34,
          3,
          52.735
        ],
        "size": [
          0.5,
          6,
          18.289999999999992
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7146",
        "type": "box",
        "position": [
          35.24,
          3,
          43.59
        ],
        "size": [
          10.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7147",
        "type": "box",
        "position": [
          35.24,
          3,
          34.69
        ],
        "size": [
          10.2,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7148",
        "type": "box",
        "position": [
          87.27,
          3,
          24.61
        ],
        "size": [
          9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7149",
        "type": "box",
        "position": [
          91.77,
          3,
          17.86
        ],
        "size": [
          0.5,
          6,
          13.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7150",
        "type": "box",
        "position": [
          82.77,
          3,
          13.805
        ],
        "size": [
          0.5,
          6,
          5.390000000000001
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7151",
        "type": "box",
        "position": [
          65.73,
          3,
          24.5
        ],
        "size": [
          34.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7152",
        "type": "box",
        "position": [
          65.73,
          3,
          16.5
        ],
        "size": [
          34.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7153",
        "type": "box",
        "position": [
          94.725,
          3,
          80.49
        ],
        "size": [
          4.489999999999995,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7154",
        "type": "box",
        "position": [
          94.36,
          3,
          72.49
        ],
        "size": [
          5.219999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7155",
        "type": "box",
        "position": [
          83.47,
          3,
          76.49
        ],
        "size": [
          0.5,
          6,
          8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7156",
        "type": "box",
        "position": [
          65.86000000000001,
          3,
          61.64
        ],
        "size": [
          34.58,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7157",
        "type": "box",
        "position": [
          70.12,
          3,
          53.64
        ],
        "size": [
          43.1,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7158",
        "type": "box",
        "position": [
          91.67,
          3,
          57.64
        ],
        "size": [
          0.5,
          6,
          8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7159",
        "type": "box",
        "position": [
          91.75,
          3,
          67.04
        ],
        "size": [
          0.5,
          6,
          10.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7160",
        "type": "box",
        "position": [
          83.15,
          3,
          67.04
        ],
        "size": [
          0.5,
          6,
          10.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7161",
        "type": "box",
        "position": [
          92.48,
          3,
          96.59
        ],
        "size": [
          0.5,
          6,
          32.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7162",
        "type": "box",
        "position": [
          83.48,
          3,
          85.555
        ],
        "size": [
          0.5,
          6,
          10.129999999999981
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7163",
        "type": "box",
        "position": [
          83.48,
          3,
          106.055
        ],
        "size": [
          0.5,
          6,
          13.269999999999996
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7164",
        "type": "box",
        "position": [
          50.84,
          3,
          72.9
        ],
        "size": [
          8.6,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7165",
        "type": "box",
        "position": [
          55.14,
          3,
          95.85499999999999
        ],
        "size": [
          0.5,
          6,
          29.689999999999984
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7166",
        "type": "box",
        "position": [
          46.540000000000006,
          3,
          91.8
        ],
        "size": [
          0.5,
          6,
          37.8
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7167",
        "type": "box",
        "position": [
          60.05499999999999,
          3,
          81.01
        ],
        "size": [
          9.72999999999999,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7168",
        "type": "box",
        "position": [
          64.14,
          3,
          72.61
        ],
        "size": [
          17.9,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7169",
        "type": "box",
        "position": [
          73.09,
          3,
          76.81
        ],
        "size": [
          0.5,
          6,
          8.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7170",
        "type": "box",
        "position": [
          69.07,
          3,
          99.19999999999999
        ],
        "size": [
          8.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7171",
        "type": "box",
        "position": [
          73.22,
          3,
          85.81
        ],
        "size": [
          0.5,
          6,
          9.61999999999999
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7172",
        "type": "box",
        "position": [
          64.91999999999999,
          3,
          90.1
        ],
        "size": [
          0.5,
          6,
          18.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7173",
        "type": "box",
        "position": [
          78.41,
          3,
          99.42
        ],
        "size": [
          10.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "wall_7174",
        "type": "box",
        "position": [
          78.41,
          3,
          90.61999999999999
        ],
        "size": [
          10.3,
          6,
          0.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          195.52,
          6.76,
          -65.87
        ],
        "size": [
          4,
          2,
          2
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          161.53,
          6.98,
          -31.09
        ],
        "size": [
          2,
          2,
          8.5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          161.33,
          3.71,
          -34.08
        ],
        "size": [
          1.5,
          6,
          2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          161.43,
          3.64,
          -27.73
        ],
        "size": [
          1.4,
          6,
          2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          121,
          6.63,
          -30.9
        ],
        "size": [
          1.1,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          140.3,
          7.1,
          -8.58
        ],
        "size": [
          4,
          2,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          106.22,
          7.03,
          0.83
        ],
        "size": [
          1.2,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          87.37,
          6.73,
          -13.37
        ],
        "size": [
          4.2,
          2,
          1.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          87.6,
          7.01,
          10.85
        ],
        "size": [
          4,
          2,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_13",
        "type": "box",
        "position": [
          140.05,
          6.89,
          10.35
        ],
        "size": [
          4.2,
          2,
          1.6
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          168.14,
          6.97,
          37.64
        ],
        "size": [
          1.6,
          2,
          4.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          96.91,
          6.82,
          76.51
        ],
        "size": [
          1.6,
          2,
          4.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          72.72,
          3.12,
          172.79
        ],
        "size": [
          1.6,
          6,
          1.9
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          72.72,
          7,
          169.59
        ],
        "size": [
          1.6,
          2,
          4.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          20.48,
          3.23,
          166.4
        ],
        "size": [
          1.6,
          6,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          20.68,
          7.06,
          169.3
        ],
        "size": [
          1.6,
          2,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          134.35,
          3.77,
          23.64
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          134.32,
          2.96,
          33.17
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          134.39,
          3.56,
          42.3
        ],
        "size": [
          11.7,
          7.2,
          1.7
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          140.91,
          3.64,
          25.23
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          140.93,
          3.66,
          34.78
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          140.88,
          3.99,
          43.97
        ],
        "size": [
          1.5,
          7.2,
          5
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          27.4,
          4.33,
          -47.91
        ],
        "size": [
          56.7,
          0.1,
          12.6
        ],
        "materialType": "ground",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          27.71,
          2.12,
          -41.79
        ],
        "size": [
          28.7,
          4.5,
          0.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          6.68,
          2.17,
          -39.44
        ],
        "size": [
          11.5,
          0.1,
          6.2
        ],
        "rotation": [
          44,
          0,
          0
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          48.84,
          2.27,
          -39.74
        ],
        "size": [
          11.6,
          0.1,
          6
        ],
        "rotation": [
          44,
          0,
          0
        ],
        "materialType": "ground",
        "meshName": null
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          12.98,
          0.93,
          -39.72
        ],
        "size": [
          1.2,
          1.5,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          12.98,
          2.98,
          -40.98
        ],
        "size": [
          1.2,
          2.5,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          12.98,
          2.25,
          -39.72
        ],
        "size": [
          1.2,
          1.1,
          1.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          42.43,
          2.33,
          -39.89
        ],
        "size": [
          1.2,
          1.1,
          1.2
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          42.33,
          0.89,
          -39.76
        ],
        "size": [
          1.2,
          1.9,
          4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          42.33,
          3,
          -41.09
        ],
        "size": [
          1.2,
          2.3,
          1.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          188.82,
          2.93,
          -92.23
        ],
        "size": [
          5.7,
          7,
          6.4
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          204,
          1.45,
          -82.54
        ],
        "size": [
          5.7,
          2.5,
          8.1
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          186.31,
          0.75,
          -74.02
        ],
        "size": [
          2.4,
          1.4,
          3.3
        ],
        "materialType": "wall",
        "meshName": null,
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          204.59,
          1.44,
          -87.89
        ],
        "size": [
          1.757465370328589,
          2.5572642381467574,
          1.7574413663201511
        ],
        "materialType": "wall",
        "meshName": "chair002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          204.84,
          1.44,
          -77.08
        ],
        "size": [
          2.152840001657381,
          2.5572642381467574,
          2.152830954113398
        ],
        "materialType": "wall",
        "meshName": "chair003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          124.62,
          2.36,
          -45.85
        ],
        "size": [
          4.35594794524178,
          4.466686896193157,
          4.690001612282799
        ],
        "materialType": "wall",
        "meshName": "crates_stacked",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          137.08,
          4.29,
          -49.6
        ],
        "size": [
          7.072999954223633,
          8.34000015258789,
          2.85144659878398
        ],
        "materialType": "wall",
        "meshName": "wall_shelves",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          144.78,
          4.29,
          -49.6
        ],
        "size": [
          8.34000015258789,
          8.34000015258789,
          2.85144659878398
        ],
        "materialType": "wall",
        "meshName": "wall_shelves001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          157.44,
          2.26,
          -44.43
        ],
        "size": [
          5.124869306974489,
          4.275760503148355,
          7.8348425867092
        ],
        "materialType": "wall",
        "meshName": "keg_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          157.94,
          1.97,
          -14.85
        ],
        "size": [
          4.052922466748356,
          3.690738274420097,
          4.30761308253085
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          155.39,
          1.97,
          -11.73
        ],
        "size": [
          4.052922466748356,
          3.690738274420097,
          4.30761308253085
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          124.47,
          3.01,
          -17.64
        ],
        "size": [
          4.170001070499438,
          5.7703789499025575,
          8.392271500590141
        ],
        "materialType": "wall",
        "meshName": "table_long_decorated_C",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          124.59,
          0.65,
          -11.65
        ],
        "size": [
          1.5637501528859161,
          1.042499956935643,
          1.5637740138177492
        ],
        "materialType": "wall",
        "meshName": "stool",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          164.35,
          1.17,
          21.16
        ],
        "size": [
          4.170000821948065,
          2.0849998672679035,
          8.340001146793384
        ],
        "materialType": "wall",
        "meshName": "table_long",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          162.77,
          3.57,
          46.61
        ],
        "size": [
          8.7,
          6.8990676468725525,
          6.7
        ],
        "materialType": "wall",
        "meshName": "box_stacked001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          154.06,
          1.67,
          48.99
        ],
        "size": [
          3.1848668356683163,
          3.0917049312002973,
          3.1795514938651124
        ],
        "materialType": "wall",
        "meshName": "box_small_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          131.43,
          1.69,
          13.76
        ],
        "size": [
          4.260210182779048,
          3.1274999329447724,
          4.2602102300157
        ],
        "materialType": "wall",
        "meshName": "box_large",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          118.24,
          1.67,
          66.17
        ],
        "size": [
          3.1465359855462083,
          3.0917049312002973,
          3.1519117178215623
        ],
        "materialType": "wall",
        "meshName": "box_small_decorated001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          101.78,
          3.57,
          68.04
        ],
        "size": [
          7.7,
          6.1,
          7.5
        ],
        "materialType": "wall",
        "meshName": "box_stacked002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          49.02,
          1.21,
          133.02
        ],
        "size": [
          3.349154446603606,
          2.16980228698435,
          2.614415169395528
        ],
        "materialType": "wall",
        "meshName": "chest_gold",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          36.79,
          2.79,
          114.43
        ],
        "size": [
          4.040640519874842,
          5.330205046825412,
          3.868601585774684
        ],
        "materialType": "wall",
        "meshName": "barrel_large_decorated",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          89.57,
          1.97,
          135.2
        ],
        "size": [
          3.8625783454449305,
          3.690738274420097,
          2.0943309827061967
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          81.71,
          3.01,
          134.11
        ],
        "size": [
          8.393263917184925,
          5.7703789499025575,
          4.171997504070561
        ],
        "materialType": "wall",
        "meshName": "table_long_decorated_C001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          71.1,
          2.26,
          134.35
        ],
        "size": [
          7.337932731056867,
          4.275760503148355,
          4.170000076293945
        ],
        "materialType": "wall",
        "meshName": "keg_decorated001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_36",
        "type": "box",
        "position": [
          93.68,
          1.97,
          135.05
        ],
        "size": [
          3.8625783454449305,
          3.690738274420097,
          2.0943309827061967
        ],
        "materialType": "wall",
        "meshName": "barrel_small_stack003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          120.71,
          1.21,
          134.96
        ],
        "size": [
          3.396459982979863,
          2.16980228698435,
          2.67561891825045
        ],
        "materialType": "wall",
        "meshName": "chest_gold001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          100.57,
          3.57,
          132.58
        ],
        "size": [
          7.245948341737744,
          6.8990676468725525,
          7.578448686971569
        ],
        "materialType": "wall",
        "meshName": "box_stacked003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          135.14,
          2.37,
          120.4
        ],
        "size": [
          2.1111022819883942,
          4.497112573409595,
          2.0850000381469727
        ],
        "materialType": "wall",
        "meshName": "table_small_decorated_B",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          78.94,
          1.44,
          153.65
        ],
        "size": [
          9.687037760079306,
          2.640169605041251,
          6.017541128824746
        ],
        "materialType": "wall",
        "meshName": "table_long_broken",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          107.07,
          1.44,
          153.64
        ],
        "size": [
          9.466253568379997,
          2.640169605041251,
          5.561150127080623
        ],
        "materialType": "wall",
        "meshName": "table_long_broken001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          109.13,
          1.14,
          171.19
        ],
        "size": [
          4.746952188438058,
          2.026126515893545,
          5.063198392341803
        ],
        "materialType": "wall",
        "meshName": "table_medium_broken",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          -15.77,
          1.14,
          185.58
        ],
        "size": [
          6.501108033266455,
          2.026126515893545,
          6.644120551591669
        ],
        "materialType": "wall",
        "meshName": "table_medium_broken001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          -9.03,
          1.44,
          185.92
        ],
        "size": [
          9.570408109219692,
          2.640169605041251,
          5.771688765302258
        ],
        "materialType": "wall",
        "meshName": "table_long_broken002",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_23",
        "type": "box",
        "position": [
          -14.81,
          3.77,
          168.25
        ],
        "size": [
          8.339277862299657,
          7.297500146141733,
          6.255000362992291
        ],
        "materialType": "wall",
        "meshName": "rubble_half001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          8.01,
          0.75,
          186.52
        ],
        "size": [
          3.336000110745431,
          1.2510001968741449,
          2.5974991752096344
        ],
        "materialType": "wall",
        "meshName": "chest001",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_25",
        "type": "box",
        "position": [
          18.03,
          1.81,
          186.62
        ],
        "size": [
          2.16635034337466,
          3.3804100273628137,
          2.5254335686679497
        ],
        "materialType": "wall",
        "meshName": "table_small_decorated_A",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          90.08,
          3.57,
          153.81
        ],
        "size": [
          6.6,
          6.2,
          7.9
        ],
        "materialType": "wall",
        "meshName": "box_stacked004",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          92.78,
          4.33,
          10.49
        ],
        "size": [
          4.6537252908040045,
          8.34000015258789,
          3.5656915300789365
        ],
        "materialType": "wall",
        "meshName": "pillar_decorated003",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          116.06,
          3.57,
          83.54
        ],
        "size": [
          7.245948341737744,
          6.8990676468725525,
          7.578448686971569
        ],
        "materialType": "wall",
        "meshName": "box_stacked005",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          115.15,
          1.76,
          128.84
        ],
        "size": [
          1.9397143695487529,
          3.4966749854724894,
          4.655946352112522
        ],
        "materialType": "wall",
        "meshName": "sword_shield_gold",
        "rotation": [
          0,
          0,
          0
        ]
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          115.15,
          1.76,
          124.05
        ],
        "size": [
          1.9397143695487529,
          3.4966749854724894,
          4.655946352112508
        ],
        "materialType": "wall",
        "meshName": "sword_shield_gold001",
        "rotation": [
          0,
          0,
          0
        ]
      }
    ],
    "sounds": {
      "music": {
        "level2-theme": {
          "url": "assets/audio/music/whispers_beneath_the_canopy.mp3",
          "loop": true
        }
      },
      "sfx": {
        "door": {
          "url": "assets/audio/sfx/door.mp3",
          "loop": false
        },
        "sword": {
          "url": "assets/audio/sfx/sword.mp3",
          "loop": false
        },
        "chest": {
          "url": "assets/audio/sfx/chest_open.mp3",
          "loop": false
        },
        "snake": {
          "url": "assets/audio/sfx/snake.wav",
          "loop": false
        },
        "potion": {
          "url": "assets/audio/sfx/potion.wav",
          "loop": false
        },
        "walk": {
          "url": "assets/audio/sfx/walking.mp3",
          "loop": false
        },
        "torch": {
          "url": "assets/audio/ambient/torch.mp3",
          "loop": false
        },
        "low-health": {
          "url": "assets/audio/sfx/low_health.mp3",
          "loop": false
        },
        "rumbling": {
          "url": "assets/audio/sfx/rumbling.wav",
          "loop": false
        }
      },
      "ambient": {
        "torch-ambient": {
          "url": "assets/audio/ambient/torch.mp3",
          "loop": true
        }
      },
      "playMusic": "level2-theme",
      "playVoiceover": null
    },
    "proximitySounds": [
      {
        "position": [
          203,
          3.7,
          -66.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          187.9,
          3.7,
          -66.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          160.3,
          4.6,
          -36.1
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      },
      {
        "position": [
          160.3,
          4.6,
          -25.7
        ],
        "sound": "torch-ambient",
        "radius": 10,
        "volume": 0.7
      }
    ],
    "enemies": [
      {
        "type": "snake",
        "position": [
          140,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            140,
            1.4,
            -30
          ],
          [
            130,
            1.4,
            -20
          ],
          [
            150,
            1.4,
            -20
          ],
          [
            145,
            1.4,
            -35
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          140,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            140,
            1.4,
            -30
          ],
          [
            130,
            1.4,
            -20
          ],
          [
            150,
            1.4,
            -20
          ],
          [
            145,
            1.4,
            -35
          ]
        ],
        "health": 18,
        "speed": 18,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          151.97,
          1.4,
          28.12
        ],
        "patrolPoints": [
          [
            151.97,
            1.4,
            28.12
          ],
          [
            141.97,
            1.4,
            38.12
          ],
          [
            161.97,
            1.4,
            38.12
          ],
          [
            156.97,
            1.4,
            23.12
          ]
        ],
        "health": 16,
        "speed": 20,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          122.02,
          1.4,
          126.51
        ],
        "patrolPoints": [
          [
            122.02,
            1.4,
            126.51
          ],
          [
            112.02,
            1.4,
            136.51
          ],
          [
            132.02,
            1.4,
            136.51
          ],
          [
            127.02,
            1.4,
            121.51
          ]
        ],
        "health": 20,
        "speed": 16,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          88.65,
          1.4,
          165.63
        ],
        "patrolPoints": [
          [
            88.65,
            1.4,
            165.63
          ],
          [
            78.65,
            1.4,
            175.63
          ],
          [
            98.65,
            1.4,
            175.63
          ],
          [
            93.65,
            1.4,
            160.63
          ]
        ],
        "health": 15,
        "speed": 22,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          220.46,
          1.4,
          69.91
        ],
        "patrolPoints": [
          [
            220.46,
            1.4,
            69.91
          ],
          [
            210.46,
            1.4,
            79.91
          ],
          [
            230.46,
            1.4,
            79.91
          ],
          [
            225.46,
            1.4,
            64.91
          ]
        ],
        "health": 17,
        "speed": 19,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          150,
          1.4,
          0
        ],
        "patrolPoints": [
          [
            150,
            1.4,
            0
          ],
          [
            130,
            1.4,
            -20
          ],
          [
            170,
            1.4,
            20
          ],
          [
            140,
            1.4,
            40
          ],
          [
            160,
            1.4,
            -40
          ]
        ],
        "health": 19,
        "speed": 17,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          85.9,
          1.4,
          100
        ],
        "patrolPoints": [
          [
            85,
            1.4,
            100
          ],
          [
            80,
            1.4,
            120
          ],
          [
            120,
            1.4,
            80
          ],
          [
            90,
            1.4,
            90
          ],
          [
            110,
            1.4,
            110
          ]
        ],
        "health": 16,
        "speed": 21,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          80,
          1.4,
          200
        ],
        "patrolPoints": [
          [
            80,
            1.4,
            200
          ],
          [
            60,
            1.4,
            180
          ],
          [
            100,
            1.4,
            220
          ],
          [
            70,
            1.4,
            190
          ],
          [
            90,
            1.4,
            210
          ]
        ],
        "health": 22,
        "speed": 15,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          238.9,
          1.4,
          70
        ],
        "patrolPoints": [
          [
            250,
            1.4,
            50
          ],
          [
            230,
            1.4,
            30
          ],
          [
            270,
            1.4,
            70
          ],
          [
            240,
            1.4,
            60
          ],
          [
            260,
            1.4,
            40
          ]
        ],
        "health": 14,
        "speed": 23,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          180.6,
          1.4,
          90.3
        ],
        "patrolPoints": [
          [
            180,
            1.4,
            100
          ],
          [
            160,
            1.4,
            80
          ],
          [
            200,
            1.4,
            120
          ],
          [
            170,
            1.4,
            90
          ],
          [
            190,
            1.4,
            110
          ]
        ],
        "health": 18,
        "speed": 18,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          300,
          1.4,
          120
        ],
        "patrolPoints": [
          [
            300,
            1.4,
            120
          ],
          [
            280,
            1.4,
            100
          ],
          [
            320,
            1.4,
            140
          ],
          [
            290,
            1.4,
            130
          ],
          [
            310,
            1.4,
            110
          ]
        ],
        "health": 17,
        "speed": 20,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          70,
          1.4,
          60
        ],
        "patrolPoints": [
          [
            70,
            1.4,
            40
          ],
          [
            60,
            1.4,
            50
          ],
          [
            80,
            1.4,
            30
          ],
          [
            65,
            1.4,
            35
          ],
          [
            75,
            1.4,
            45
          ]
        ],
        "health": 16,
        "speed": 21,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          198.7,
          1.4,
          -30.1
        ],
        "patrolPoints": [
          [
            200,
            1.4,
            -20
          ],
          [
            190,
            1.4,
            -10
          ],
          [
            210,
            1.4,
            -30
          ],
          [
            195,
            1.4,
            -25
          ],
          [
            205,
            1.4,
            -15
          ]
        ],
        "health": 19,
        "speed": 17,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          40,
          1.4,
          160
        ],
        "patrolPoints": [
          [
            40,
            1.4,
            160
          ],
          [
            30,
            1.4,
            170
          ],
          [
            50,
            1.4,
            150
          ],
          [
            35,
            1.4,
            155
          ],
          [
            45,
            1.4,
            165
          ]
        ],
        "health": 15,
        "speed": 22,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          108,
          1.4,
          75
        ],
        "patrolPoints": [
          [
            108,
            1.4,
            75
          ],
          [
            104,
            1.4,
            78
          ],
          [
            112,
            1.4,
            72
          ],
          [
            106,
            1.4,
            82
          ],
          [
            110,
            1.4,
            68
          ]
        ],
        "health": 16,
        "speed": 38,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          96,
          1.4,
          85
        ],
        "patrolPoints": [
          [
            96,
            1.4,
            85
          ],
          [
            92,
            1.4,
            88
          ],
          [
            100,
            1.4,
            82
          ],
          [
            94,
            1.4,
            92
          ],
          [
            98,
            1.4,
            78
          ]
        ],
        "health": 18,
        "speed": 36,
        "chaseRange": 14,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          84,
          1.4,
          95
        ],
        "patrolPoints": [
          [
            84,
            1.4,
            95
          ],
          [
            80,
            1.4,
            98
          ],
          [
            88,
            1.4,
            92
          ],
          [
            82,
            1.4,
            102
          ],
          [
            86,
            1.4,
            88
          ]
        ],
        "health": 20,
        "speed": 34,
        "chaseRange": 16,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          102,
          1.4,
          90
        ],
        "patrolPoints": [
          [
            102,
            1.4,
            90
          ],
          [
            98,
            1.4,
            93
          ],
          [
            106,
            1.4,
            87
          ],
          [
            100,
            1.4,
            97
          ],
          [
            104,
            1.4,
            83
          ]
        ],
        "health": 17,
        "speed": 37,
        "chaseRange": 13,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          90,
          1.4,
          80
        ],
        "patrolPoints": [
          [
            90,
            1.4,
            80
          ],
          [
            86,
            1.4,
            83
          ],
          [
            94,
            1.4,
            77
          ],
          [
            88,
            1.4,
            87
          ],
          [
            92,
            1.4,
            73
          ]
        ],
        "health": 19,
        "speed": 35,
        "chaseRange": 15,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          85,
          1.4,
          125
        ],
        "patrolPoints": [
          [
            85,
            1.4,
            125
          ],
          [
            81,
            1.4,
            128
          ],
          [
            89,
            1.4,
            122
          ],
          [
            83,
            1.4,
            132
          ],
          [
            87,
            1.4,
            118
          ]
        ],
        "health": 15,
        "speed": 40,
        "chaseRange": 18,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          80,
          1.4,
          120
        ],
        "patrolPoints": [
          [
            80,
            1.4,
            120
          ],
          [
            76,
            1.4,
            123
          ],
          [
            84,
            1.4,
            117
          ],
          [
            78,
            1.4,
            127
          ],
          [
            82,
            1.4,
            113
          ]
        ],
        "health": 22,
        "speed": 32,
        "chaseRange": 17,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          90,
          1.4,
          130
        ],
        "patrolPoints": [
          [
            90,
            1.4,
            130
          ],
          [
            86,
            1.4,
            133
          ],
          [
            94,
            1.4,
            127
          ],
          [
            88,
            1.4,
            137
          ],
          [
            92,
            1.4,
            123
          ]
        ],
        "health": 21,
        "speed": 33,
        "chaseRange": 19,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          20,
          1.4,
          -50
        ],
        "patrolPoints": [
          [
            20,
            1.4,
            -50
          ],
          [
            10,
            1.4,
            -60
          ],
          [
            30,
            1.4,
            -40
          ],
          [
            15,
            1.4,
            -45
          ],
          [
            25,
            1.4,
            -55
          ]
        ],
        "health": 15,
        "speed": 35,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          50,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            -10,
            1.4,
            0
          ],
          [
            -15,
            1.4,
            -10
          ],
          [
            -5,
            1.4,
            10
          ],
          [
            -12,
            1.4,
            5
          ],
          [
            -8,
            1.4,
            -5
          ]
        ],
        "health": 18,
        "speed": 32,
        "chaseRange": 15,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          50,
          1.4,
          -80
        ],
        "patrolPoints": [
          [
            50,
            1.4,
            -80
          ],
          [
            40,
            1.4,
            -90
          ],
          [
            60,
            1.4,
            -70
          ],
          [
            45,
            1.4,
            -75
          ],
          [
            55,
            1.4,
            -85
          ]
        ],
        "health": 20,
        "speed": 38,
        "chaseRange": 14,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          100.4,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            100,
            1.4,
            -60
          ],
          [
            90,
            1.4,
            -70
          ],
          [
            110,
            1.4,
            -50
          ],
          [
            95,
            1.4,
            -55
          ],
          [
            105,
            1.4,
            -65
          ]
        ],
        "health": 16,
        "speed": 36,
        "chaseRange": 13,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          180,
          1.4,
          -30
        ],
        "patrolPoints": [
          [
            180,
            1.4,
            -30
          ],
          [
            170,
            1.4,
            -40
          ],
          [
            190,
            1.4,
            -20
          ],
          [
            175,
            1.4,
            -25
          ],
          [
            185,
            1.4,
            -35
          ]
        ],
        "health": 22,
        "speed": 34,
        "chaseRange": 16,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          240,
          1.4,
          10
        ],
        "patrolPoints": [
          [
            240,
            1.4,
            10
          ],
          [
            230,
            1.4,
            0
          ],
          [
            250,
            1.4,
            20
          ],
          [
            235,
            1.4,
            15
          ],
          [
            245,
            1.4,
            5
          ]
        ],
        "health": 19,
        "speed": 37,
        "chaseRange": 11,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          200,
          1.4,
          85.2
        ],
        "patrolPoints": [
          [
            200,
            1.4,
            82.5
          ],
          [
            190,
            1.4,
            90
          ],
          [
            206.6,
            1.4,
            94
          ],
          [
            195,
            1.4,
            90
          ],
          [
            205,
            1.4,
            95
          ]
        ],
        "health": 17,
        "speed": 39,
        "chaseRange": 17,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          150,
          1.4,
          150
        ],
        "patrolPoints": [
          [
            150,
            1.4,
            150
          ],
          [
            140,
            1.4,
            140
          ],
          [
            160,
            1.4,
            160
          ],
          [
            145,
            1.4,
            155
          ],
          [
            155,
            1.4,
            145
          ]
        ],
        "health": 21,
        "speed": 33,
        "chaseRange": 18,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          80,
          1.4,
          180
        ],
        "patrolPoints": [
          [
            80,
            1.4,
            180
          ],
          [
            70,
            1.4,
            170
          ],
          [
            90,
            1.4,
            190
          ],
          [
            75,
            1.4,
            185
          ],
          [
            85,
            1.4,
            175
          ]
        ],
        "health": 14,
        "speed": 40,
        "chaseRange": 19,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          30,
          1.4,
          120
        ],
        "patrolPoints": [
          [
            30,
            1.4,
            120
          ],
          [
            20,
            1.4,
            110
          ],
          [
            40,
            1.4,
            130
          ],
          [
            25,
            1.4,
            125
          ],
          [
            35,
            1.4,
            115
          ]
        ],
        "health": 23,
        "speed": 31,
        "chaseRange": 20,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          27,
          1.4,
          40
        ],
        "patrolPoints": [
          [
            -5,
            1.4,
            80
          ],
          [
            -10,
            1.4,
            70
          ],
          [
            20,
            1.4,
            90
          ],
          [
            24,
            1.4,
            20
          ],
          [
            26,
            1.4,
            40
          ]
        ],
        "health": 16,
        "speed": 42,
        "chaseRange": 14,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          116.7,
          1.4,
          70
        ],
        "patrolPoints": [
          [
            120,
            1.4,
            50
          ],
          [
            110,
            1.4,
            40
          ],
          [
            130,
            1.4,
            60
          ],
          [
            115,
            1.4,
            55
          ],
          [
            125,
            1.4,
            45
          ]
        ],
        "health": 18,
        "speed": 35,
        "chaseRange": 16,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          220,
          1.4,
          180
        ],
        "patrolPoints": [
          [
            220,
            1.4,
            180
          ],
          [
            210,
            1.4,
            170
          ],
          [
            230,
            1.4,
            190
          ],
          [
            215,
            1.4,
            185
          ],
          [
            225,
            1.4,
            175
          ]
        ],
        "health": 20,
        "speed": 36,
        "chaseRange": 15,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          10,
          1.4,
          -20
        ],
        "patrolPoints": [
          [
            10,
            1.4,
            -20
          ],
          [
            0,
            1.4,
            -30
          ],
          [
            20,
            1.4,
            -10
          ],
          [
            5,
            1.4,
            -15
          ],
          [
            15,
            1.4,
            -25
          ]
        ],
        "health": 17,
        "speed": 41,
        "chaseRange": 13,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          190,
          1.4,
          30
        ],
        "patrolPoints": [
          [
            190,
            1.4,
            30
          ],
          [
            180,
            1.4,
            20
          ],
          [
            200,
            1.4,
            40
          ],
          [
            185,
            1.4,
            35
          ],
          [
            195,
            1.4,
            25
          ]
        ],
        "health": 19,
        "speed": 38,
        "chaseRange": 17,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          151.97,
          1.4,
          28.12
        ],
        "patrolPoints": [
          [
            151.97,
            1.4,
            28.12
          ],
          [
            141.97,
            1.4,
            38.12
          ],
          [
            161.97,
            1.4,
            38.12
          ],
          [
            156.97,
            1.4,
            23.12
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          122.02,
          1.4,
          126.51
        ],
        "patrolPoints": [
          [
            122.02,
            1.4,
            126.51
          ],
          [
            112.02,
            1.4,
            136.51
          ],
          [
            132.02,
            1.4,
            136.51
          ],
          [
            127.02,
            1.4,
            121.51
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          88.65,
          1.4,
          165.63
        ],
        "patrolPoints": [
          [
            88.65,
            1.4,
            165.63
          ],
          [
            78.65,
            1.4,
            175.63
          ],
          [
            98.65,
            1.4,
            175.63
          ],
          [
            93.65,
            1.4,
            160.63
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          179,
          1.4,
          48
        ],
        "patrolPoints": [
          [
            179,
            1.4,
            48
          ],
          [
            169,
            1.4,
            58
          ],
          [
            189,
            1.4,
            58
          ],
          [
            184,
            1.4,
            43
          ]
        ],
        "health": 18,
        "speed": 36,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          179,
          1.4,
          48
        ],
        "patrolPoints": [
          [
            179,
            1.4,
            48
          ],
          [
            169,
            1.4,
            58
          ],
          [
            189,
            1.4,
            58
          ],
          [
            184,
            1.4,
            43
          ],
          [
            174,
            1.4,
            38
          ]
        ],
        "health": 22,
        "speed": 18,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          90.6,
          1.4,
          21
        ],
        "patrolPoints": [
          [
            93,
            1.4,
            31
          ],
          [
            83,
            1.4,
            41
          ],
          [
            103,
            1.4,
            41
          ],
          [
            98,
            1.4,
            26
          ]
        ],
        "health": 16,
        "speed": 38,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          87.1,
          1.4,
          22.4
        ],
        "patrolPoints": [
          [
            93,
            1.4,
            31
          ],
          [
            83,
            1.4,
            41
          ],
          [
            103,
            1.4,
            41
          ],
          [
            98,
            1.4,
            26
          ],
          [
            88,
            1.4,
            21
          ]
        ],
        "health": 20,
        "speed": 20,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          239,
          1.4,
          42
        ],
        "patrolPoints": [
          [
            239,
            1.4,
            42
          ],
          [
            229,
            1.4,
            52
          ],
          [
            249,
            1.4,
            52
          ],
          [
            244,
            1.4,
            37
          ]
        ],
        "health": 19,
        "speed": 35,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          239,
          1.4,
          42
        ],
        "patrolPoints": [
          [
            239,
            1.4,
            42
          ],
          [
            229,
            1.4,
            52
          ],
          [
            249,
            1.4,
            52
          ],
          [
            244,
            1.4,
            37
          ],
          [
            234,
            1.4,
            32
          ]
        ],
        "health": 24,
        "speed": 17,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          202,
          1.4,
          19
        ],
        "patrolPoints": [
          [
            202,
            1.4,
            19
          ],
          [
            192,
            1.4,
            29
          ],
          [
            212,
            1.4,
            29
          ],
          [
            207,
            1.4,
            14
          ]
        ],
        "health": 17,
        "speed": 37,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          202,
          1.4,
          19
        ],
        "patrolPoints": [
          [
            202,
            1.4,
            19
          ],
          [
            192,
            1.4,
            29
          ],
          [
            212,
            1.4,
            29
          ],
          [
            207,
            1.4,
            14
          ],
          [
            197,
            1.4,
            9
          ]
        ],
        "health": 21,
        "speed": 19,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          239,
          1.4,
          5
        ],
        "patrolPoints": [
          [
            239,
            1.4,
            5
          ],
          [
            229,
            1.4,
            15
          ],
          [
            249,
            1.4,
            15
          ],
          [
            244,
            1.4,
            0
          ]
        ],
        "health": 15,
        "speed": 40,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          239,
          1.4,
          5
        ],
        "patrolPoints": [
          [
            239,
            1.4,
            5
          ],
          [
            229,
            1.4,
            15
          ],
          [
            249,
            1.4,
            15
          ],
          [
            244,
            1.4,
            0
          ],
          [
            234,
            1.4,
            -5
          ]
        ],
        "health": 19,
        "speed": 21,
        "chaseRange": 12,
        "modelUrl": "assets/enemies/snake_boss/Snake_Angry.gltf"
      },
      {
        "type": "snake",
        "position": [
          220.46,
          1.4,
          69.91
        ],
        "patrolPoints": [
          [
            220.46,
            1.4,
            69.91
          ],
          [
            210.46,
            1.4,
            79.91
          ],
          [
            230.46,
            1.4,
            79.91
          ],
          [
            225.46,
            1.4,
            64.91
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          -4.63,
          1.4,
          179.3
        ],
        "patrolPoints": [
          [
            -4.63,
            1.4,
            179.3
          ],
          [
            -14.63,
            1.4,
            189.3
          ],
          [
            5.37,
            1.4,
            189.3
          ],
          [
            0.37,
            1.4,
            174.3
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake",
        "position": [
          75.63,
          1.4,
          -7.35
        ],
        "patrolPoints": [
          [
            75.63,
            1.4,
            -7.35
          ],
          [
            65.63,
            1.4,
            2.65
          ],
          [
            85.63,
            1.4,
            2.65
          ],
          [
            80.63,
            1.4,
            -12.35
          ]
        ],
        "health": 35,
        "speed": 15,
        "chaseRange": 10,
        "modelUrl": "assets/enemies/snake/scene.gltf"
      },
      {
        "type": "snake_boss",
        "position": [
          30,
          2,
          -25
        ],
        "patrolPoints": [
          [
            30,
            2,
            -25
          ],
          [
            25,
            2,
            -20
          ],
          [
            35,
            2,
            -30
          ],
          [
            40,
            2,
            -20
          ],
          [
            25,
            2,
            -35
          ]
        ],
        "health": 500,
        "speed": 3,
        "chaseRange": 12
      }
    ],
    "collectibles": {
      "chests": [
        {
          "id": "chest_341",
          "position": [
            102.83618171070033,
            0.1245687627273453,
            127.53572840599536
          ],
          "contents": "apple"
        },
        {
          "id": "chest_342",
          "position": [
            179.49076303736004,
            0.22766118299212934,
            96.26284249506361
          ],
          "contents": "apple"
        }
      ],
      "apples": [],
      "potions": [],
      "llm_gpt": [],
      "llm_claude": [],
      "llm_gemini": []
    },
    "lights": [
      {
        "key": "StarLight",
        "props": {
          "position": [
            -12.025823053848388,
            15.124568762727346,
            178.1670737408198
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            107.02806399789891,
            15.185896041341389,
            162.76484097209587
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            37.3222404385603,
            15.124568762727346,
            120.04517725703103
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            130.9762479960251,
            15.124568762727346,
            124.34771920664302
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            130.82457819522133,
            15.149992735917541,
            131.6524554717438
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            25.759123747308454,
            15.161363815776973,
            57.40978236364007
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            113.60075814069711,
            15.124568762727346,
            75.45198084352933
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            45.84881244172108,
            15.161363806448112,
            18.457558176388886
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            163.83881610949769,
            15.227661212603742,
            94.95998318210349
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            240.16020953998367,
            15.161363806448094,
            76.45611044544076
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            239.88417501943894,
            15.161363806448112,
            -0.5912993552164365
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            193.86038360355045,
            15.161363806448112,
            -34.19794303311772
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "StarLight",
        "props": {
          "position": [
            40.11368964583366,
            17.308840240606493,
            17.848062963685287
          ],
          "modelPath": "assets/cute_little_star.glb",
          "scale": 5
        }
      },
      {
        "key": "PointPulse",
        "props": {
          "position": [
            25.9,
            8,
            -4.5
          ],
          "color": 16737792,
          "intensity": 2,
          "distance": 15,
          "speed": 3
        }
      },
      {
        "key": "PointPulse",
        "props": {
          "position": [
            56.5,
            8,
            -9.4
          ],
          "color": 16737792,
          "intensity": 2,
          "distance": 15,
          "speed": 2.8
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            145.374145581186,
            5.804794296862261,
            11.882736073091916
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            134.718151932843,
            5.78268465742263,
            11.873464661495646
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            122.78516775876871,
            5.8474919952326525,
            -25.81796271767555
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            122.75289002363303,
            5.824311796058366,
            -36.01769063926521
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            134.79668037901118,
            5.831041284225208,
            -10.272701839548002
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            145.54804548665086,
            5.8339097924993535,
            -10.276329057023784
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            159.64732128633787,
            5.9357392145356025,
            -25.767635617352212
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            159.64663134792835,
            5.930372938679281,
            -36.04501493705355
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            187.78189640126286,
            5.035426533687112,
            -67.44935354436615
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            203.18593802560247,
            5.048047534339984,
            -67.47103610381599
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.70471656341971,
            5.8849883912178385,
            -38.4618296114502
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.88480904996993,
            5.6559444764186875,
            -30.103860185871703
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            54.83320893498765,
            5.721480316701198,
            -21.880698367170048
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            43.38295419129252,
            5.7420850327988315,
            -6.875723878004884
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            35.086182852268365,
            5.6551266296830685,
            -6.808340860162892
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            16.001505350542764,
            5.613292466314125,
            -6.759154512626444
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            7.0153821498284445,
            5.669436370044735,
            -6.841128185313431
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.11166590370448343,
            5.7438761097532876,
            -13.588768247718344
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.04525689946449157,
            5.599711198663363,
            -21.77999583757773
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.09954785225139173,
            5.7058433319904465,
            -30.075894906304015
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            0.0996039348799318,
            5.618667104333225,
            -38.20669516180944
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            91.9121400525824,
            5.5043045497272765,
            69.33307068033353
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            91.51432073396393,
            5.562602432290042,
            83.21989440009406
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            92.90541521601358,
            5.506758574108859,
            114.40778822379639
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            82.56781117153821,
            5.440672710092432,
            114.15160209205409
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            19.853359171024938,
            5.473284686564114,
            174.6788413619447
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            46.18353898830183,
            5.520312449833668,
            165.2070604462412
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            73.35210557060873,
            5.447575131243129,
            163.71518970921977
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            31.061820073507484,
            5.508550899910855,
            165.3792369084329
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            166.53481479466527,
            5.57478373643869,
            32.45325588393239
          ],
          "particleCount": 10
        }
      },
      {
        "key": "FlameParticles",
        "props": {
          "position": [
            166.49003849952368,
            5.607541597099899,
            42.969325896
          ],
          "particleCount": 10
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            83.43254766317186,
            1.2057601587692057,
            111.77327652375475
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            83.36469817213991,
            1.2837301509369499,
            105.26460041098828
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.93749187886783,
            1.3245305189437893,
            105.4131052066785
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            92.01687998314709,
            1.2738924665817104,
            103.8530075210911
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.93445268528446,
            1.1468793128405508,
            99.84808244835246
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            76.8348612416366,
            1.1690747691887304,
            136.6856170131267
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            86.72046111617131,
            1.1568386427489756,
            136.6394145696907
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            43.16081674167087,
            1.2209428415269354,
            173.82469978882676
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            47.248717558787604,
            1.215091691338967,
            173.9365686334229
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            33.54359217925317,
            1.2684842742320261,
            173.86320290989576
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            27.962142718073412,
            1.2475184889173712,
            173.7379627763736
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            27.901049520849455,
            1.2410534857407918,
            165.32341602390284
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            29.50983264071492,
            1.0855084875448937,
            173.79064853608793
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.653955461457368,
            1.335990593395947,
            173.83289340256317
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.432948856916415,
            1.2901892043725935,
            165.29445978090334
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.589232408805948,
            1.1198598939653714,
            47.73786196842747
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.706710753144954,
            1.210215805905272,
            43.60889604601839
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.660677775299362,
            1.1023718397493927,
            34.31194906619159
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.63143393707036,
            1.1242937196725413,
            30.207751318766427
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            21.597538914819626,
            1.239614254889096,
            3.8544445540238788
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            30.165402325457187,
            1.2733517314603309,
            4.028640010477144
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            82.74369785979741,
            1.2034744995497018,
            -20.95165217270131
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            91.34355557777239,
            1.1615141852497464,
            -20.85240575533394
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.3777859516799,
            1.114140558774249,
            14.772258208550278
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.36108239718956,
            1.1770794874358907,
            14.81711214854276
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.88521202137773,
            1.1240535256298756,
            14.802388272582611
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            210.98731822288883,
            1.1948395727054164,
            14.761609953261308
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.4715987963806,
            1.1822178903789826,
            29.04207923290771
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.46850876190013,
            1.2181301539013119,
            32.94598130834198
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.42559485440637,
            1.1891704632705762,
            42.42033989301887
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.4907449690739,
            1.1519639880645105,
            46.7048155345102
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            210.8989220530201,
            1.311559575994403,
            60.86318304106383
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            206.69803220092484,
            1.1479738139653146,
            60.69789116499635
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.50778540340613,
            1.2654254234350866,
            60.92830557604289
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            191.78947455535467,
            1.2749757215178599,
            60.87365108168619
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.33186633788972,
            1.2245386546324122,
            60.8548883958861
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            191.9705364266468,
            1.1724918117894392,
            52.32504686468006
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            185.3635425903781,
            1.2253986693052052,
            60.87219511164419
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            211.95444995536872,
            1.2066072460699182,
            79.18318396149154
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            215.96929948212698,
            1.1057289410892723,
            79.2154750209055
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            225.31042463564654,
            1.2774561341042998,
            79.34945366129405
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            229.50486855612542,
            1.1408690237743233,
            79.1650620371092
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            234.96679274350097,
            1.3025838129933796,
            59.961916586274874
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            234.99701732370139,
            1.3603076492769484,
            65.11817820324278
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            243.43501109998562,
            1.1988560885186335,
            64.98130416169266
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            243.3879196285108,
            1.3115789654224153,
            59.929574626867
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.97170953818862,
            1.1609243582644542,
            30.345325977895833
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.84173408543633,
            1.0301794412424936,
            34.43992916530665
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            49.02306292406539,
            1.2221312128210777,
            43.76446997096573
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            48.98097966483144,
            1.336698357713803,
            47.87445208866004
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            193.2713699522292,
            1.1566013820618113,
            14.821601434415163
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            196.12370846579444,
            2.676754784929564,
            14.570970839037999
          ]
        }
      },
      {
        "key": "CastleBioluminescentPlant",
        "props": {
          "position": [
            197.3569011448118,
            1.1710099136056555,
            14.834863149356453
          ]
        }
      }
    ],
    "npcs": [],
    "platforms": [],
    "interactiveObjects": [],
    "triggers": [],
    "meshAnimations": [
      {
        "meshName": "Lift2",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -225.86,
              10.11,
              124.18
            ],
            [
              -229.68,
              9.65,
              254.86
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -259.41,
              10.11,
              110.38
            ],
            [
              -387.15,
              10.11,
              184.13
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift",
        "animationType": "moving",
        "data": {
          "speed": 10,
          "path": [
            [
              -496.88,
              11.9,
              195.35
            ],
            [
              -506.55,
              48.81,
              192.95
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3001",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              344.83,
              10.11,
              -36.05
            ],
            [
              544.8,
              22.52,
              -33.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3002",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              557.24,
              10.11,
              99.12
            ],
            [
              558.04,
              9.65,
              405.84
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "Lift3003",
        "animationType": "moving",
        "data": {
          "speed": 2,
          "path": [
            [
              525.43,
              10.11,
              419.27
            ],
            [
              334.2,
              9.69,
              432.04
            ]
          ],
          "loopBehavior": "loop"
        }
      },
      {
        "meshName": "TreeNode2",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      },
      {
        "meshName": "TreeNode1",
        "animationType": "rotating",
        "data": {
          "axis": [
            0,
            1,
            0
          ],
          "speed": 1
        }
      }
    ],
    "placeableBlocks": []
  }
];