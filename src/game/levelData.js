// Data-driven level definitions with GLTF geometry loading
export const levels = [
  {
    "id": "level1A",
    "name": "Level 1A",
    "gltfUrl": "assets/levels/revamped/ControlRoom.gltf",
    "startPosition": [
      0,
      12,
      0
    ],
    "lights": [
      {
        "key": "BasicLights",
        "props": {
          "intensity": 0.8
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [0, 22, 0],
          "color": 0xffffff,
          "intensity": 5,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      },
      {
        "key": "PointLight",
        "props": {
          "position": [0, 22, -25],
          "color": 0xffffff,
          "intensity": 4,
          "distance": 0,
          "decay": 0,
          "castShadow": false
        }
      }
    ],
    "ui": [
      "hud",
      "coordinates"
    ],
    "enemies": [],
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
        "materialType": "wall"
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Platform",
        "materialType": "ground"
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground"
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform1",
        "materialType": "ground"
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Platform2",
        "materialType": "ground"
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3",
        "materialType": "ground"
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Platform8",
        "materialType": "ground"
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform4",
        "materialType": "ground"
      },
      {
        "id": "collider_13",
        "type": "mesh",
        "meshName": "Lift2",
        "materialType": "ground"
      },
      {
        "id": "collider_14",
        "type": "mesh",
        "meshName": "Lift3",
        "materialType": "ground"
      },
      {
        "id": "collider_15",
        "type": "mesh",
        "meshName": "Platform5",
        "materialType": "ground"
      },
      {
        "id": "collider_16",
        "type": "mesh",
        "meshName": "Leaf",
        "materialType": "ground"
      },
      {
        "id": "collider_17",
        "type": "mesh",
        "meshName": "Lift",
        "materialType": "ground"
      },
      {
        "id": "collider_18",
        "type": "mesh",
        "meshName": "Platform7",
        "materialType": "ground"
      },
      {
        "id": "collider_19",
        "type": "mesh",
        "meshName": "Elevated_Ground",
        "materialType": "ground"
      },
      {
        "id": "collider_2",
        "type": "mesh",
        "meshName": "Platform001",
        "materialType": "ground"
      },
      {
        "id": "collider_3",
        "type": "mesh",
        "meshName": "Platform002",
        "materialType": "ground"
      },
      {
        "id": "collider_4",
        "type": "mesh",
        "meshName": "Platform3002",
        "materialType": "ground"
      },
      {
        "id": "collider_5",
        "type": "mesh",
        "meshName": "Cube",
        "materialType": "ground"
      },
      {
        "id": "collider_6",
        "type": "mesh",
        "meshName": "Lift3001",
        "materialType": "ground"
      },
      {
        "id": "collider_7",
        "type": "mesh",
        "meshName": "Platform4001",
        "materialType": "ground"
      },
      {
        "id": "collider_8",
        "type": "mesh",
        "meshName": "Platform3003",
        "materialType": "ground"
      },
      {
        "id": "collider_9",
        "type": "mesh",
        "meshName": "Lift3002",
        "materialType": "ground"
      },
      {
        "id": "collider_10",
        "type": "mesh",
        "meshName": "Platform3004",
        "materialType": "ground"
      },
      {
        "id": "collider_11",
        "type": "mesh",
        "meshName": "Lift3003",
        "materialType": "ground"
      },
      {
        "id": "collider_12",
        "type": "mesh",
        "meshName": "Platform3006",
        "materialType": "ground"
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
  },
  {
    "id": "level1",
    "name": "Level 1: The Forgotten Forest",
    "gltfUrl": "assets/levels/Level1/MapFinal.gltf",
    "startPosition": [
      0,
      10,
      0
    ],
    "lights": [
      {
        "key": "BasicLights",
        "props": {
          "intensity": 0.1
        }
      }
    ],
    "ui": [
      "hud"
    ],
    "colliders": [
      {
        "id": "terrain_collider",
        "type": "mesh",
        "meshName": "Plane",
        "materialType": "ground"
      },
      {
        "id": "terrain_collider1",
        "type": "mesh",
        "meshName": "Plane.002",
        "materialType": "ground"
      },
      {
        "id": "terrain_collider2",
        "type": "mesh",
        "meshName": "Plane.001",
        "materialType": "ground"
      },
      {
        "id": "collider_2",
        "type": "box",
        "position": [
          74.2805404663086,
          7.5009472370147705,
          -56.235137939453125
        ],
        "size": [
          19.902694702148438,
          5.858898639678955,
          10.625641107559204
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
        "type": "mesh",
        "meshName": "platform_slope_6x6x4_yellow",
        "materialType": "ground"
      },
      {
        "id": "collider_4",
        "type": "box",
        "position": [
          5.5328874588012695,
          6.560379505157471,
          -39.361785888671875
        ],
        "size": [
          4,
          4,
          4
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
          -0.7773474454879761,
          7.7403247356414795,
          -34.49150085449219
        ],
        "size": [
          4,
          6.359890460968018,
          4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_6",
        "type": "box",
        "position": [
          -7.600991249084473,
          7.39626932144165,
          -39.86438751220703
        ],
        "size": [
          4,
          5.671779632568359,
          4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_7",
        "type": "box",
        "position": [
          -0.9068508148193359,
          6.942425727844238,
          -44.346160888671875
        ],
        "size": [
          4,
          4.764092445373535,
          4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_8",
        "type": "box",
        "position": [
          23.03496217727661,
          6.138877149025461,
          -71.54387201368809
        ],
        "size": [
          5.399998188018799,
          1.5000004855794487,
          0.6770776808261871
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_9",
        "type": "box",
        "position": [
          -7.70367431640625,
          6.367399926582834,
          -71.71390070021152
        ],
        "size": [
          5.399998188018799,
          1.5000004855794487,
          0.6770776808261871
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_10",
        "type": "box",
        "position": [
          -104.65445419167133,
          24.920733763746878,
          -126.77250456817343
        ],
        "size": [
          24.789909072596956,
          48.51913720787156,
          37.77458682674464
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_11",
        "type": "box",
        "position": [
          -104.98836456630886,
          24.7562984799664,
          -32.538482326040125
        ],
        "size": [
          40.69060569251519,
          41.743743810529345,
          45.635473520354914
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_12",
        "type": "box",
        "position": [
          -29.94930589199066,
          4.7365807592868805,
          -102.64478647708893
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_13",
        "type": "box",
        "position": [
          -31.322409987449646,
          5.004567056894302,
          -36.78919565677643
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_15",
        "type": "mesh",
        "meshName": "Vert006",
        "materialType": "ground"
      },
      {
        "id": "collider_16",
        "type": "mesh",
        "meshName": "Vert002",
        "materialType": "ground"
      },
      {
        "id": "collider_17",
        "type": "box",
        "position": [
          -46.52409362792969,
          4.0269834995269775,
          84.87931823730469
        ],
        "size": [
          8.94277798516788,
          3.9855432510375977,
          7.869289272857088
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_18",
        "type": "box",
        "position": [
          -34.94508361816406,
          4.02698391581069,
          86.84906005859375
        ],
        "size": [
          14.279910634361954,
          3.9855440836050224,
          3.9855454667441563
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_19",
        "type": "box",
        "position": [
          -36.979637145996094,
          4.02698391581069,
          82.81128692626953
        ],
        "size": [
          9.923266372250481,
          3.9855440836050224,
          3.9855448813904957
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_20",
        "type": "box",
        "position": [
          -29.958999633789062,
          4.0269834995269775,
          82.75906372070312
        ],
        "size": [
          3.9855433485751703,
          3.9855432510375977,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_21",
        "type": "box",
        "position": [
          -26.888111114501953,
          4.0269834995269775,
          83.69717407226562
        ],
        "size": [
          2.2308865622320866,
          3.9855432510375977,
          2.083818300131867
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_22",
        "type": "box",
        "position": [
          -25.770734786987305,
          4.0269834995269775,
          86.76978302001953
        ],
        "size": [
          3.9855433485751703,
          3.9855432510375977,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_23",
        "type": "mesh",
        "meshName": "platform_slope_4x2x2_blue",
        "materialType": "ground"
      },
      {
        "id": "collider_24",
        "type": "box",
        "position": [
          -46.73193359375,
          6.001815557479858,
          101.48796844482422
        ],
        "size": [
          8.94277798516788,
          7.935207366943359,
          7.869289272857088
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_25",
        "type": "mesh",
        "meshName": "platform_slope_4x2x2_blue001",
        "materialType": "ground"
      },
      {
        "id": "collider_26",
        "type": "box",
        "position": [
          -30.733980178833008,
          9.859891414642334,
          101.45291137695312
        ],
        "size": [
          5.322484835175285,
          7.696027755737305,
          7.869288786438716
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_27",
        "type": "box",
        "position": [
          -31.817974090576172,
          4.02698391581069,
          101.37708282470703
        ],
        "size": [
          20.877674104116707,
          3.9855440836050224,
          7.52411413326098
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_28",
        "type": "box",
        "position": [
          -25.74932098388672,
          15.232730125813676,
          103.28273010253906
        ],
        "size": [
          4.685793632511647,
          3.3673119056800864,
          4.144108051304386
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_29",
        "type": "box",
        "position": [
          -30.733980178833008,
          15.23272979259491,
          101.45291137695312
        ],
        "size": [
          5.322484835175285,
          3.3673112392425537,
          7.869288786438716
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_30",
        "type": "box",
        "position": [
          -30.44427483276489,
          15.312430476219935,
          108.27524431529348
        ],
        "size": [
          3.9855449380184496,
          5.978316695494772,
          5.978315656982744
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_31",
        "type": "box",
        "position": [
          -14.110549926757812,
          4.0269834995269775,
          102.84857177734375
        ],
        "size": [
          3.9855433485751686,
          3.9855432510375977,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_32",
        "type": "box",
        "position": [
          -14.122164726257324,
          13.009011200694431,
          102.91752624511719
        ],
        "size": [
          3.188434726371515,
          14.585986273232718,
          3.1884347263715256
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_33",
        "type": "box",
        "position": [
          -14.146226882934577,
          20.500306248664856,
          102.99749016675611
        ],
        "size": [
          3.9855433485751686,
          0.9963858127593994,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_34",
        "type": "box",
        "position": [
          -8.02215766906739,
          19.11698067188263,
          97.57085442456861
        ],
        "size": [
          3.9855433485751686,
          0.9963858127593994,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_35",
        "type": "box",
        "position": [
          -7.86309814453125,
          12.353586613062383,
          97.64027404785156
        ],
        "size": [
          3.188434726371514,
          13.029683234446525,
          3.1884347263715256
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_36",
        "type": "box",
        "position": [
          -7.850957870483398,
          4.0269834995269775,
          97.57080841064453
        ],
        "size": [
          3.9855433485751677,
          3.9855432510375977,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_37",
        "type": "box",
        "position": [
          -4.458431243896492,
          16.670228123664856,
          89.85930657300611
        ],
        "size": [
          3.985543348575168,
          0.9963858127593994,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_38",
        "type": "box",
        "position": [
          -4.6721954345703125,
          11.069489429206854,
          89.7857437133789
        ],
        "size": [
          3.188434726371513,
          10.706942658004747,
          3.1884347263715256
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_39",
        "type": "box",
        "position": [
          -4.536918640136719,
          4.0269834995269775,
          89.83826446533203
        ],
        "size": [
          3.9855433485751686,
          3.9855432510375977,
          3.9855433485751632
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_40",
        "type": "box",
        "position": [
          -8.270793318748474,
          5.457823187112808,
          69.70811879634857
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_41",
        "type": "mesh",
        "meshName": "arch_red",
        "materialType": "wall"
      },
      {
        "id": "collider_45",
        "type": "box",
        "position": [
          -37.33783027153335,
          7.128245829674199,
          88.32971954345712
        ],
        "size": [
          9.14948403796651,
          1.9927721006325783,
          1.6169295394491172
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
          -50.46330261230469,
          10.865873812767461,
          101.33258013597683
        ],
        "size": [
          1.6169284505147061,
          1.9927721006325783,
          5.777126351934001
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
          -46.748661722949365,
          10.865873812767461,
          104.68184661865243
        ],
        "size": [
          9.14948403796651,
          1.9927721006325783,
          1.6169295394491172
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
          -53.93143733102229,
          7.372822283836797,
          100.68596672925611
        ],
        "size": [
          5.978314722415874,
          5.978315351670176,
          3.985543726151377
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_49",
        "type": "box",
        "position": [
          -61.97539269924164,
          5.164033800363541,
          115.84091603755951
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_50",
        "type": "box",
        "position": [
          -60.21644723415375,
          4.969306379556656,
          54.171818137168884
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
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
          -118.84523320315787,
          6.904409887319858,
          108.39310228749616
        ],
        "size": [
          7.995287512733512,
          4.980007726219667,
          6.501294838309377
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_52",
        "type": "box",
        "position": [
          -29.05535888671873,
          15.842398285865784,
          96.3176957509998
        ],
        "size": [
          2.2368062784832468,
          0.5592014789581299,
          2.236806278483243
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_53",
        "type": "box",
        "position": [
          -29.126226425170877,
          10.25213873386383,
          96.34265150051152
        ],
        "size": [
          2.2368062784832468,
          0.5592014789581299,
          2.236806278483243
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_54",
        "type": "box",
        "position": [
          -32.469535827636705,
          7.317672371864319,
          96.38854993801152
        ],
        "size": [
          2.2368062784832503,
          0.5592014789581299,
          2.236806278483243
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_55",
        "type": "box",
        "position": [
          -28.985286712646463,
          4.876017212867737,
          96.39340986232793
        ],
        "size": [
          2.2368062784832468,
          0.5592014789581299,
          2.236806278483243
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_56",
        "type": "box",
        "position": [
          -32.509208679199205,
          12.825354218482971,
          96.48574842433965
        ],
        "size": [
          2.2368062784832503,
          0.5592014789581299,
          2.236806278483243
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_57",
        "type": "box",
        "position": [
          10.841623902320862,
          5.492876440286636,
          20.445183157920837
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_58",
        "type": "box",
        "position": [
          43.22808914460377,
          4.574681367888839,
          40.76490444226124
        ],
        "size": [
          9.462042692949481,
          10.03342146480464,
          8.647213375922696
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_59",
        "type": "box",
        "position": [
          87.89673101902008,
          5.614331632852554,
          0.5184520483016968
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_60",
        "type": "box",
        "position": [
          95.23290503025055,
          6.082692056894302,
          14.52939260005951
        ],
        "size": [
          3.2251484394073486,
          2.2597965598106384,
          2.9891364574432373
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_61",
        "type": "box",
        "position": [
          71.97465586662292,
          4.970793237909675,
          -97.68993711471558
        ],
        "size": [
          3.048760414123535,
          1.8989749141037464,
          2.479071617126465
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_62",
        "type": "box",
        "position": [
          52.1449259519577,
          5.038195177912712,
          -108.86051398515701
        ],
        "size": [
          3.4200847148895264,
          2.3162826597690582,
          3.476110100746155
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_63",
        "type": "box",
        "position": [
          30.897358090377182,
          8.231673354068612,
          -85.75586883817252
        ],
        "size": [
          3.4334573554441334,
          3.011497134284019,
          3.8811477836965054
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_64",
        "type": "box",
        "position": [
          31.1728857755661,
          12.895193926748135,
          -95.57546734809875
        ],
        "size": [
          2.000000238418579,
          4.705846676925772,
          10.714676141738892
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_65",
        "type": "box",
        "position": [
          22.67157733440399,
          12.040248847937999,
          -95.22147369384766
        ],
        "size": [
          2.000000238418579,
          3.0000000458232208,
          6
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_66",
        "type": "box",
        "position": [
          -6.446720242500305,
          12.040248847937999,
          -95.43769836425781
        ],
        "size": [
          2.000000238418579,
          3.0000000458232208,
          6
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_67",
        "type": "box",
        "position": [
          -14.597328305244446,
          12.895193926748135,
          -94.67270398139954
        ],
        "size": [
          2.000000238418579,
          4.705846676925772,
          10.714676141738892
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_15",
        "type": "box",
        "position": [
          163.84441902652236,
          -5.599573676390628,
          -15.908546461952653
        ],
        "size": [
          31.95752552951376,
          21.4844456117798,
          28.08303990475713
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_16",
        "type": "box",
        "position": [
          237.98524773482995,
          4.03463422337159,
          -15.84718638467433
        ],
        "size": [
          120.63033909266687,
          1.44874830361303,
          27.92981286864176
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "materialType": "ground"
      },
      {
        "id": "collider_19",
        "type": "mesh",
        "meshName": "Material2",
        "materialType": "ground"
      },
      {
        "id": "collider_20",
        "type": "mesh",
        "meshName": "Material2001",
        "materialType": "ground"
      },
      {
        "id": "collider_21",
        "type": "mesh",
        "meshName": "Material2002",
        "materialType": "ground"
      },
      {
        "id": "collider_22",
        "type": "mesh",
        "meshName": "Material2003",
        "materialType": "ground"
      },
      {
        "id": "collider_23",
        "type": "mesh",
        "meshName": "Material2004",
        "materialType": "ground"
      },
      {
        "id": "collider_24",
        "type": "mesh",
        "meshName": "Material2005",
        "materialType": "ground"
      },
      {
        "id": "collider_25",
        "type": "mesh",
        "meshName": "Material2006",
        "materialType": "ground"
      },
      {
        "id": "collider_26",
        "type": "mesh",
        "meshName": "Material2007",
        "materialType": "ground"
      },
      {
        "id": "collider_27",
        "type": "mesh",
        "meshName": "Material3",
        "materialType": "ground"
      }
    ],
    "enemies": [
      {
        "type": "crawler",
        "position": [
          -96.52538399754636,
          10,
          -66.5118688899278
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [
          [
            -107.03309455185763,
            4.371583282947537,
            -67.97596895595322,
            0.5
          ],
          [
            -82.16833714242087,
            4.386999247278588,
            -66.9916161216205,
            0.5
          ],
          [
            -98.36404482919352,
            4.371583282947537,
            -65.93389918910225,
            0.5
          ]
        ],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 2
      },
      {
        "type": "crawler",
        "position": [
          -96.04560059974065,
          10,
          -96.07712864231434
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [
          [
            -105.52633809591835,
            4.371583282947544,
            -93.40976258902069,
            0.5
          ],
          [
            -80.96319521289452,
            4.507312030957806,
            -86.03458170509346,
            0.5
          ],
          [
            -96.20946062269489,
            4.371583282947537,
            -96.56738218113016,
            0.5
          ]
        ],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 4
      },
      {
        "type": "crawler",
        "position": [
          -41.75171970853199,
          10,
          75.7019740103841
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [
          [
            -43.386436268055405,
            4.37158328294754,
            52.65581130349482,
            0.5
          ],
          [
            -22.817437931819036,
            4.601603791947017,
            56.131916203753406,
            0.5
          ],
          [
            -23.802498135540265,
            4.37158328294754,
            75.51055759506065,
            0.5
          ],
          [
            -41.828625873911164,
            4.371583282947537,
            75.91666284156452,
            0.5
          ],
          [
            -43.36306198881633,
            4.37158328294754,
            53.17200729420725,
            0.5
          ]
        ],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 15
      },
      {
        "type": "crawler",
        "position": [
          99.71090027287109,
          10,
          78.4959829838058
        ],
        "modelUrl": "assets/enemies/crawler/Crawler.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "chaseRange": 5,
        "id": 49
      },
      {
        "type": "mech_boss",
        "position": [
          363.35,
          2.35,
          -15.41
        ],
        "modelUrl": "assets/enemies/robot_boss/scene.gltf",
        "patrolPoints": [],
        "speed": 1.5,
        "scale": 15,
        "chaseRange": 15,
        "id": 13
      }
    ],
    "npcs": [
      {
        "type": "yellow_bot",
        "position": [
          -75.25,
          7,
          84.55
        ],
        "modelUrl": "assets/npc/yellow_bot/scene.gltf",
        "patrolPoints": [],
        "speed": 2,
        "scale": 5,
        "chaseRange": 0,
        "id": 36
      }
    ],
    "platforms": [
      {
        "id": "platform_13",
        "type": "static",
        "position": [
          21.07535583490078,
          4.4287377595901525,
          -8.95893954894854
        ],
        "size": [
          4,
          0.5,
          4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "texture": "wood",
        "textureUrl": "",
        "textureRepeat": [
          1,
          1
        ],
        "color": 8947848,
        "materialType": "platform",
        "friction": 0.5,
        "restitution": 0.3
      },
      {
        "id": "platform_14",
        "type": "moving",
        "position": [
          9.614665414399102,
          4.38558800580747,
          -8.547226379114415
        ],
        "size": [
          4,
          0.5,
          4
        ],
        "rotation": [
          0,
          0,
          0
        ],
        "texture": "wood",
        "textureUrl": "",
        "textureRepeat": [
          1,
          1
        ],
        "color": 8947848,
        "materialType": "platform",
        "friction": 0.5,
        "restitution": 0.3,
        "animation": {
          "type": "path",
          "speed": 2,
          "path": [
            [
              0.13021153593746249,
              10.215773048324966,
              -32.49150085449219
            ],
            [
              11.931070299297707,
              4.40864848246839,
              -3.7256459306666265
            ]
          ]
        }
      }
    ],
    "interactiveObjects": [
      {
        "id": "interactive_13",
        "objectType": "pressurePlate",
        "position": [
          1.935534115424172,
          4.371583282947544,
          -10.736291961935553
        ],
        "size": 2,
        "activationWeight": 50,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_14",
        "objectType": "pressurePlate",
        "position": [
          2.4052795458538547,
          4.37158328294754,
          -11.206037392365129
        ],
        "size": 2,
        "activationWeight": 20,
        "pressedHeight": -0.1,
        "color": 65280
      },
      {
        "id": "interactive_15",
        "objectType": "pressurePlate",
        "position": [
          12.751076332347527,
          4.406622984193202,
          -16.61739216882129
        ],
        "size": 2,
        "activationWeight": 10,
        "pressedHeight": -0.1,
        "color": 65280
      }
    ],
    "triggers": [],
    "meshAnimations": []
  },
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
    "id": "level2",
    "name": "Level 3: The Serpent's Labyrinth",
    "order": 0,
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
                "text": "But beware—the snakes that guard them are not ordinary creatures;"
              },
              {
                "at": 14000,
                "ms": 6000,
                "text": "each one slithers with its own cunning, and if they catch you—well, let’s just say you won’t be making it out alive."
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": null
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
        "meshName": "chair002"
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
        "meshName": "chair003"
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
        "meshName": "crates_stacked"
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
        "meshName": "wall_shelves"
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
        "meshName": "wall_shelves001"
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
        "meshName": "keg_decorated"
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
        "meshName": "barrel_small_stack"
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
        "meshName": "barrel_small_stack001"
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
        "meshName": "table_long_decorated_C"
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
        "meshName": "stool"
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
        "meshName": "table_long"
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
        "meshName": "box_stacked001"
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
        "meshName": "box_small_decorated"
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
        "meshName": "box_large"
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
        "meshName": "box_small_decorated001"
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
        "meshName": "box_stacked002"
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
        "meshName": "chest_gold"
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
        "meshName": "barrel_large_decorated"
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
        "meshName": "barrel_small_stack002"
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
        "meshName": "table_long_decorated_C001"
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
        "meshName": "keg_decorated001"
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
        "meshName": "barrel_small_stack003"
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
        "meshName": "chest_gold001"
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
        "meshName": "box_stacked003"
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
        "meshName": "table_small_decorated_B"
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
        "meshName": "table_long_broken"
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
        "meshName": "table_long_broken001"
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
        "meshName": "table_medium_broken"
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
        "meshName": "table_medium_broken001"
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
        "meshName": "table_long_broken002"
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
        "meshName": "rubble_half001"
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
        "meshName": "chest001"
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
        "meshName": "table_small_decorated_A"
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
        "meshName": "box_stacked004"
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
        "meshName": "pillar_decorated003"
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
        "meshName": "box_stacked005"
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
        "meshName": "sword_shield_gold"
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
        "meshName": "sword_shield_gold001"
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
      15,
      0
    ],
    "lights": [
      "BasicLights"
    ],
    "ui": [
      "hud"
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_2",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_3",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_4",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_5",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_6",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_7",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_8",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_9",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_10",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_11",
    "type": "box",
    "position": [
      161.18165588378906,
      -0.19309920072555542,
      -155.77396392822266
    ],
    "size": [
      16.274251708984377,
      2.8083125448226927,
      22.595159301757814
    ],
    "rotation": [
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_12",
    "type": "box",
    "position": [
      160.86512756347656,
      -2.704921007156372,
      -178.07762908935547
    ],
    "size": [
      16.274251708984377,
      3.9336817359924314,
      22.506231079101564
    ],
    "rotation": [
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_13",
    "type": "box",
    "position": [
      160.66148376464844,
      -5.584710597991943,
      -196.40837860107422
    ],
    "size": [
      16.05998779296875,
      3.2884395217895506,
      15.990636596679687
    ],
    "rotation": [
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_14",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_15",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_16",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_17",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_18",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_19",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_20",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_21",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_22",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_23",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_24",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_25",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_26",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_27",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_28",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_29",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_30",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_31",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_32",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_33",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_34",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_35",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_36",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_37",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_38",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_39",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_40",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_41",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_42",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_43",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_44",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_45",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_46",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_47",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_48",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_49",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_50",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_51",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_52",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_53",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_54",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_55",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_56",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_57",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_58",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_59",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_60",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_61",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_62",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_63",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_64",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_65",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_66",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_67",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_68",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_69",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_70",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_71",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_72",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_73",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_74",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_75",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_76",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_77",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_78",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_79",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_80",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_81",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_82",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_83",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_84",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_85",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_86",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_87",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_88",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_89",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_90",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_91",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_92",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_93",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_94",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_95",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_96",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_97",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_98",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_99",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_100",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_101",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_102",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_103",
    "type": "box",
    "position": [
      -69.45324325561523,
      -2.9126479625701904,
      55.86862850189209
    ],
    "size": [
      120.59045196533204,
      2.316493282318115,
      66.20233894348145
    ],
    "rotation": [
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_104",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_105",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_106",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_107",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_108",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_109",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_110",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_111",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_112",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_113",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_114",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_115",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_116",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  },
  {
    "id": "collider_117",
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
      0.0,
      0.0,
      -0.0
    ],
    "materialType": "wall"
  }
]
  }
];