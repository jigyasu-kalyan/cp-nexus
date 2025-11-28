// import { Express } from 'express';

// interface RouteInfo {
//     method: string;
//     path: string;
// }

// /**
//  * Manual list of known routes (fallback if auto-detection fails)
//  */
// // const knownRoutes: RouteInfo[] = [
// //     // Health check
// //     { method: 'GET', path: '/api/health' },
// //     // Auth routes
// //     { method: 'POST', path: '/api/v1/auth/register' },
// //     { method: 'POST', path: '/api/v1/auth/login' },
// //     // User routes
// //     { method: 'GET', path: '/api/v1/users/me' },
// //     // Team routes
// //     { method: 'POST', path: '/api/v1/teams' },
// //     { method: 'GET', path: '/api/v1/teams' },
// //     { method: 'GET', path: '/api/v1/team/:teamId' },
// //     // Profile routes
// //     { method: 'POST', path: '/api/v1/profiles/link' },
// //     // Dashboard routes
// //     { method: 'GET', path: '/api/v1/dashboard/stats' },
// // ];

// /**
//  * Recursively extracts routes from Express router stack
//  * Works with Express 4 and Express 5
//  */
// const extractRoutes = (stack: any[], basePath: string = ''): RouteInfo[] => {
//     const routes: RouteInfo[] = [];
//     if (!stack || !Array.isArray(stack)) {
//         return routes;
//     }

//     stack.forEach((layer: any) => {
//         if (!layer) return;

//         // Handle direct routes
//         if (layer.route) {
//             const path = basePath + (layer.route.path || '');
//             Object.keys(layer.route.methods || {}).forEach((method) => {
//                 if (layer.route.methods[method]) {
//                     routes.push({
//                         method: method.toUpperCase(),
//                         path: path || '/',
//                     });
//                 }
//             });
//         }
//         // Handle router middleware (mounted routers)
//         else if (layer.name === 'router' || layer.name === 'bound dispatch' || (layer.regexp && layer.handle && layer.handle.stack)) {
//             // Extract the mount path from the regexp
//             let routerPath = basePath;
            
//             if (layer.regexp) {
//                 const regexSource = layer.regexp.source;
//                 // Try to extract the path from the regex
//                 const pathMatch = regexSource.match(/^\\\/(.*?)(?:\\\/)?\?/);
//                 if (pathMatch && pathMatch[1]) {
//                     routerPath = basePath + '/' + pathMatch[1].replace(/\\\//g, '/');
//                 } else if (layer.keys && layer.keys.length > 0) {
//                     // Handle parameterized routes
//                     routerPath = basePath;
//                 }
//             }
            
//             // Clean up the path
//             routerPath = routerPath.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
            
//             if (layer.handle && layer.handle.stack) {
//                 const nestedRoutes = extractRoutes(layer.handle.stack, routerPath);
//                 routes.push(...nestedRoutes);
//             }
//         }
//     });

//     return routes;
// };

// /**
//  * Logs all defined routes and their methods in the Express application
//  * to the console, showing a clean tabular view.
//  */
// export const logRoutes = (app: Express): void => {
//     try {
//         // Try different ways to access the router stack for Express 4 and 5
//         let routerStack: any[] = [];
        
//         // Express 4/5 router access
//         if ((app as any)._router && (app as any)._router.stack) {
//             routerStack = (app as any)._router.stack;
//         } else if ((app as any).router && (app as any).router.stack) {
//             routerStack = (app as any).router.stack;
//         } else if ((app as any).stack) {
//             routerStack = (app as any).stack;
//         }

//         let routes = extractRoutes(routerStack);

//         // If auto-detection failed, use manual list
//         if (routes.length === 0) {
//             console.log('⚠️  Auto-detection failed, using manual route list');
//             routes = knownRoutes;
//         }

//         if (routes.length === 0) {
//             console.log('\n--- CP-Nexus Express Routes ---');
//             console.warn('No routes detected.');
//             console.log('-------------------------------\n');
//             return;
//         }

//         // Remove duplicates and sort
//         const uniqueRoutes = Array.from(
//             new Map(routes.map(r => [`${r.method}:${r.path}`, r])).values()
//         ).sort((a, b) => {
//             if (a.path < b.path) return -1;
//             if (a.path > b.path) return 1;
//             return 0;
//         });

//         const routeTable = uniqueRoutes.map(route => ({
//             Method: route.method,
//             Path: route.path,
//         }));

//         console.log('\n--- CP-Nexus Express Route Map ---');
//         console.log(`Total routes: ${uniqueRoutes.length}\n`);
//         console.table(routeTable);
//         console.log('------------------------------------\n');
//     } catch (error) {
//         console.error('Error logging routes:', error);
//         // Fallback to manual list on error
//         console.log('\n--- CP-Nexus Express Routes (Fallback) ---');
//         const routeTable = knownRoutes.map(route => ({
//             Method: route.method,
//             Path: route.path,
//         }));
//         console.table(routeTable);
//         console.log('--------------------------------------------\n');
//     }
// };