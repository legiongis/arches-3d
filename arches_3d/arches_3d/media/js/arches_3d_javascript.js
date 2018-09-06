require.config({
    paths: {
        'spidergl': '../packages/three-d-hop/minimal/js/spidergl',
        'nexus': '../packages/three-d-hop/minimal/js/nexus',
        'presenter': '../packages/three-d-hop/minimal/js/presenter',
        'ply': '../packages/three-d-hop/minimal/js/ply',
        'trackball_sphere': '../packages/three-d-hop/minimal/js/trackball_sphere',
        'trackball_turntable': '../packages/three-d-hop/minimal/js/trackball_turntable',
        'trackball_turntable_pan': '../packages/three-d-hop/minimal/js/trackball_turntable_pan',
        'trackball_pantilt': '../packages/three-d-hop/minimal/js/trackball_pantilt',
        'init': '../packages/three-d-hop/minimal/js/init',
        // 'setup': '../packages/three-d-hop/js/setup',
        'knockstrap': '../packages/knockstrap',
        'three-d-hop': 'reports/three-d-hop'
    },
    shim: {
        'spidergl': {
            exports: 'SpiderGL'
        },
        'presenter': {
            deps: ['spidergl'],
            exports: 'Presenter'
        },
        'nexus': {
            deps: ['presenter'],
            exports: 'Nexus'
        },
        'ply': {
            deps: ['nexus'],
        },
        'trackball_sphere': {
            deps: ['ply'],
            exports: 'PanTiltTrackball'
        },
        'trackball_sphere': {
            deps: ['ply'],
            exports: 'PanTiltTrackball'
        },
        'trackball_turntable': {
            deps: ['ply'],
            exports: 'TurnTableTrackball'
        },
        'trackball_turntable_pan': {
            deps: ['ply'],
            exports: 'TurntablePanTrackball'
        },
        'trackball_pantilt': {
            deps: ['ply'],
            exports: 'PanTiltTrackball'
        },
        'init': {
            deps: ['trackball_pantilt']
        },
        'three-d-hop': {
            deps: ['init']
        },
    }
});