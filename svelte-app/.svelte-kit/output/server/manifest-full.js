export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["css/bootswatch-simplex.min.css","favicon.png","images/cs3214.png","images/svelte-logo.svg"]),
	mimeTypes: {".css":"text/css",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.f5601b4c.js","imports":["_app/immutable/entry/start.f5601b4c.js","_app/immutable/chunks/index.5c9a020e.js","_app/immutable/chunks/singletons.fef9560c.js","_app/immutable/chunks/index.f2b4f84c.js","_app/immutable/chunks/environment.8a2736f2.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.20511bc0.js","imports":["_app/immutable/entry/app.20511bc0.js","_app/immutable/chunks/index.5c9a020e.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js'),
			() => import('./nodes/5.js'),
			() => import('./nodes/6.js'),
			() => import('./nodes/7.js'),
			() => import('./nodes/8.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 3 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 4 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 5 },
				endpoint: null
			},
			{
				id: "/player",
				pattern: /^\/player\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 6 },
				endpoint: null
			},
			{
				id: "/protected",
				pattern: /^\/protected\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/public",
				pattern: /^\/public\/?$/,
				params: [],
				page: { layouts: [0], errors: [1], leaf: 8 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
