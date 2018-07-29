module.exports = {
    'handle': [// 网络回包处理的方法类
        require('LobbyRecvMsgs'),
        require('RoomRecvMsgs'),
    ],
    'send': {
        'LobbySendMsgs': [// 发给服务器的消息
            {
                'id': 'ID_C2S_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id': 'ID_C2S_ENTER_ROOM',
                'function': 'onEnterRoom',
                'desc': '创建房间',
            },
            {
                'id': 'ID_C2S_TALK',
                'function': 'onTalk',
                'desc': '说话聊天',
            },
            {
                'id': 'ID_C2S_JOIN_ROOM_ON_LOBBY',
                'function': 'onJoinRoomOnLobby',
                'desc': '有人加入房间',
            }

        ],
        'RoomSendMsgs': [// 发给服务器的消息
            {
                'id': 'ID_C2S_DELETE_ROOM',
                'function': 'onDeleteRoom',
                'desc': '删除房间',
            },
            {
                'id': 'ID_C2S_READY',
                'function': 'onReady',
                'desc': '房间中准备',
            },
            {
                'id': 'ID_C2S_START_GAME',
                'function': 'onStartGame',
                'desc': '房主开始游戏',
            },

        ],
    },
    'recv': {
        'LobbyRecvMsgs': [// 服务器回包
            {
                'id': 'ID_S2C_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id': 'ID_S2C_ENTER_ROOM',
                'function': 'onEnterRoom',
                'desc': '大厅加入房间',
            },
            {
                'id': 'ID_S2C_TALK',
                'function': 'onTalk',
                'desc': '大厅聊天',
            },
            {
                'id': 'ID_S2C_CREATE_ROOM_INFO',
                'function': 'onCreateRoomInfo',
                'desc': '创建房间成功，返回房间信息',
            },
            {
                'id': 'ID_S2C_CREATE_ROOM_FAILED',
                'function': 'onCreateRoomFailed',
                'desc': '创建房间失败，服务器返回的错误信息',
            },
            {
                'id': 'ID_S2C_JOIN_HALL_TEST',
                'function': 'onJoinHallTest',
                'desc': '测试',
            },
            {
                'id': 'ID_S2C_ROOM_INFO_ON_LOBBY',
                'function': 'onRoomInfoOnLobby',
                'desc': '加入房间成功，服务器给返回的房间信息',
            },
        ],
        'RoomRecvMsgs': [// 房间服务器回包
            {
                'id': 'ID_S2C_ROOM_TALK',
                'function': 'onRoomTalk',
                'desc': '房间聊天',
            },
            {
                'id': 'ID_S2C_JOIN_ROOM',
                'function': 'onJoinRoom',
                'desc': '房间有人加入',
            },
            {
                'id': 'ID_S2C_ROOM_INFO',
                'function': 'onRoomInfo',
                'desc': '加入房间成功，服务器给返回的房间信息',
            },
            {
                'id': 'ID_S2C_DELETE_ROOM',
                'function': 'onDeleteRoom',
                'desc': '删除房间',
            },
            {
                'id': 'ID_S2C_READY',
                'function': 'onReady',
                'desc': '删除房间',
            },
            {
                'id': 'ID_S2C_GAME_STARTED',
                'function': 'onStartGame',
                'desc': '开始游戏',
            },
            {
                'id': 'ID_S2C_FAPAI',
                'function': 'onFaPai',
                'desc': '发牌',
            },
            {
                'id': 'ID_S2C_ACTION_INFO',
                'function': 'onActionInfo',
                'desc': '用户可以选择的操作信息',
            },
        ],
    }


}



