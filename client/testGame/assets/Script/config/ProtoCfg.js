module.exports = {
    'handle':[// 网络回包处理的方法类
        require('LobbyRecvMsgs'),
        require('RoomRecvMsgs'),
    ],
    'send': {
        'LobbySendMsg': [// 发给服务器的消息
            {
                'id':'ID_C2S_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_C2S_ENTER_ROOM',
                'function': 'onEnterRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_C2S_DELETE_ROOM',
                'function': 'onDeleteRoom',
                'desc': '删除房间',
            },
            {
                'id':'ID_C2S_TALK',
                'function': 'onTalk',
                'desc': '说话聊天',
            }
        ],
    },
    'recv': {
        'LobbyRecvMsgs': [// 服务器回包
            {
                'id':'ID_S2C_CREATE_ROOM',
                'function': 'onCreateRoom',
                'desc': '创建房间',
            },
            {
                'id':'ID_S2C_ENTER_ROOM',
                'function': 'onEnterRoom',
                'desc': '大厅加入房间',
            },
            {
                'id':'ID_S2C_TALK',
                'function': 'onTalk',
                'desc': '大厅聊天',
            },
            {
                'id':'ID_S2C_CREATE_ROOM_INFO',
                'function': 'onCreateRoomInfo',
                'desc': '创建房间成功，返回房间信息',
            },
            {
                'id':'ID_S2C_CREATE_ROOM_FAILED',
                'function': 'onCreateRoomFailed',
                'desc': '创建房间失败，服务器返回的错误信息',
            },
            {
                'id':'ID_S2C_JOIN_HALL_TEST',
                'function': 'onJoinHallTest',
                'desc': '测试',
            },
        ],
        'RoomRecvMsgs': [// 房间服务器回包
            {
                'id':'ID_S2C_ROOM_TALK',
                'function': 'onRoomTalk',
                'desc': '房间聊天',
            },
            {
                'id':'ID_S2C_JOIN_ROOM',
                'function': 'onJoinRoom',
                'desc': '房间有人加入',
            },
            {
                'id':'ID_S2C_ROOM_INFO',
                'function': 'onRoomInfo',
                'desc': '加入房间成功，服务器给返回的房间信息',
            },
        ],
    }


}



