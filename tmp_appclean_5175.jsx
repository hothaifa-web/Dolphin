import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App_clean.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=fe209aa2"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=fe209aa2"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import { Routes, Route, Navigate } from "/node_modules/.vite/deps/react-router-dom.js?v=fe209aa2";
import Splash from "/src/pages/Splash.jsx?t=1766093412933";
import Login from "/src/pages/Login.jsx?t=1766099570498";
import Register from "/src/pages/Register.jsx?t=1766099561334";
import Driver from "/src/pages/Driver.jsx?t=1766099561334";
function Placeholder({ title }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDEV("h1", { className: "text-2xl font-bold", children: title }, void 0, false, {
    fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
    lineNumber: 9,
    columnNumber: 73
  }, this) }, void 0, false, {
    fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
    lineNumber: 9,
    columnNumber: 10
  }, this);
}
_c = Placeholder;
export default function App() {
  return /* @__PURE__ */ jsxDEV(Routes, { children: [
    /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(Navigate, { to: "/splash", replace: true }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 15,
      columnNumber: 32
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 15,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/splash", element: /* @__PURE__ */ jsxDEV(Splash, {}, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 16,
      columnNumber: 38
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 16,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/login", element: /* @__PURE__ */ jsxDEV(Login, {}, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 17,
      columnNumber: 37
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 17,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/register", element: /* @__PURE__ */ jsxDEV(Register, {}, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 18,
      columnNumber: 40
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 18,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/admin", element: /* @__PURE__ */ jsxDEV(Placeholder, { title: "Admin Dashboard (placeholder)" }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 19,
      columnNumber: 37
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 19,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/customer", element: /* @__PURE__ */ jsxDEV(Placeholder, { title: "Customer Home (placeholder)" }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 20,
      columnNumber: 40
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 20,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/driver", element: /* @__PURE__ */ jsxDEV(Driver, {}, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 21,
      columnNumber: 38
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 21,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "/store", element: /* @__PURE__ */ jsxDEV(Placeholder, { title: "Store Dashboard (placeholder)" }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 22,
      columnNumber: 37
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 22,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(Route, { path: "*", element: /* @__PURE__ */ jsxDEV(Placeholder, { title: "Not Found" }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 23,
      columnNumber: 32
    }, this) }, void 0, false, {
      fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
      lineNumber: 23,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}
_c2 = App;
var _c, _c2;
$RefreshReg$(_c, "Placeholder");
$RefreshReg$(_c2, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/malomari-/Desktop/New folder (4)/src/App_clean.jsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBUXlFO0FBUnpFLE9BQU9BLFdBQVc7QUFDbEIsU0FBU0MsUUFBUUMsT0FBT0MsZ0JBQWdCO0FBQ3hDLE9BQU9DLFlBQVk7QUFDbkIsT0FBT0MsV0FBVztBQUNsQixPQUFPQyxjQUFjO0FBQ3JCLE9BQU9DLFlBQVk7QUFFbkIsU0FBU0MsWUFBWSxFQUFDQyxNQUFLLEdBQUU7QUFDM0IsU0FBUSx1QkFBQyxTQUFJLFdBQVUsaURBQWdELGlDQUFDLFFBQUcsV0FBVSxzQkFBc0JBLG1CQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQTBDLEtBQXpHO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBOEc7QUFDeEg7QUFBQ0MsS0FGUUY7QUFJVCx3QkFBd0JHLE1BQUs7QUFDM0IsU0FDRSx1QkFBQyxVQUNDO0FBQUEsMkJBQUMsU0FBTSxNQUFLLEtBQUksU0FBUyx1QkFBQyxZQUFTLElBQUcsV0FBVSxTQUFPLFFBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEIsS0FBdkQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwRDtBQUFBLElBQzFELHVCQUFDLFNBQU0sTUFBSyxXQUFVLFNBQVMsdUJBQUMsWUFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQU8sS0FBdEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF5QztBQUFBLElBQ3pDLHVCQUFDLFNBQU0sTUFBSyxVQUFTLFNBQVMsdUJBQUMsV0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQU0sS0FBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUF1QztBQUFBLElBQ3ZDLHVCQUFDLFNBQU0sTUFBSyxhQUFZLFNBQVMsdUJBQUMsY0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQVMsS0FBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUE2QztBQUFBLElBQzdDLHVCQUFDLFNBQU0sTUFBSyxVQUFTLFNBQVMsdUJBQUMsZUFBWSxPQUFNLG1DQUFuQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWtELEtBQWhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBbUY7QUFBQSxJQUNuRix1QkFBQyxTQUFNLE1BQUssYUFBWSxTQUFTLHVCQUFDLGVBQVksT0FBTSxpQ0FBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFnRCxLQUFqRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW9GO0FBQUEsSUFDcEYsdUJBQUMsU0FBTSxNQUFLLFdBQVUsU0FBUyx1QkFBQyxZQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBTyxLQUF0QztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXlDO0FBQUEsSUFDekMsdUJBQUMsU0FBTSxNQUFLLFVBQVMsU0FBUyx1QkFBQyxlQUFZLE9BQU0sbUNBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBa0QsS0FBaEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFtRjtBQUFBLElBQ25GLHVCQUFDLFNBQU0sTUFBSyxLQUFJLFNBQVMsdUJBQUMsZUFBWSxPQUFNLGVBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEIsS0FBdkQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwRDtBQUFBLE9BVDVEO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FVQTtBQUVKO0FBQUNDLE1BZHVCRDtBQUFHLElBQUFELElBQUFFO0FBQUFDLGFBQUFILElBQUE7QUFBQUcsYUFBQUQsS0FBQSIsIm5hbWVzIjpbIlJlYWN0IiwiUm91dGVzIiwiUm91dGUiLCJOYXZpZ2F0ZSIsIlNwbGFzaCIsIkxvZ2luIiwiUmVnaXN0ZXIiLCJEcml2ZXIiLCJQbGFjZWhvbGRlciIsInRpdGxlIiwiX2MiLCJBcHAiLCJfYzIiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQXBwX2NsZWFuLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCB7IFJvdXRlcywgUm91dGUsIE5hdmlnYXRlIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSdcclxuaW1wb3J0IFNwbGFzaCBmcm9tICcuL3BhZ2VzL1NwbGFzaCdcclxuaW1wb3J0IExvZ2luIGZyb20gJy4vcGFnZXMvTG9naW4nXHJcbmltcG9ydCBSZWdpc3RlciBmcm9tICcuL3BhZ2VzL1JlZ2lzdGVyJ1xyXG5pbXBvcnQgRHJpdmVyIGZyb20gJy4vcGFnZXMvRHJpdmVyJ1xyXG5cclxuZnVuY3Rpb24gUGxhY2Vob2xkZXIoe3RpdGxlfSl7XHJcbiAgcmV0dXJuICg8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiPjxoMSBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGRcIj57dGl0bGV9PC9oMT48L2Rpdj4pXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCgpe1xyXG4gIHJldHVybiAoXHJcbiAgICA8Um91dGVzPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9cIiBlbGVtZW50PXs8TmF2aWdhdGUgdG89XCIvc3BsYXNoXCIgcmVwbGFjZS8+fSAvPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9zcGxhc2hcIiBlbGVtZW50PXs8U3BsYXNoLz59IC8+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2xvZ2luXCIgZWxlbWVudD17PExvZ2luLz59IC8+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL3JlZ2lzdGVyXCIgZWxlbWVudD17PFJlZ2lzdGVyLz59IC8+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2FkbWluXCIgZWxlbWVudD17PFBsYWNlaG9sZGVyIHRpdGxlPVwiQWRtaW4gRGFzaGJvYXJkIChwbGFjZWhvbGRlcilcIi8+fSAvPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9jdXN0b21lclwiIGVsZW1lbnQ9ezxQbGFjZWhvbGRlciB0aXRsZT1cIkN1c3RvbWVyIEhvbWUgKHBsYWNlaG9sZGVyKVwiLz59IC8+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiL2RyaXZlclwiIGVsZW1lbnQ9ezxEcml2ZXIvPn0gLz5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvc3RvcmVcIiBlbGVtZW50PXs8UGxhY2Vob2xkZXIgdGl0bGU9XCJTdG9yZSBEYXNoYm9hcmQgKHBsYWNlaG9sZGVyKVwiLz59IC8+XHJcbiAgICAgIDxSb3V0ZSBwYXRoPVwiKlwiIGVsZW1lbnQ9ezxQbGFjZWhvbGRlciB0aXRsZT1cIk5vdCBGb3VuZFwiLz59IC8+XHJcbiAgICA8L1JvdXRlcz5cclxuICApXHJcbn1cclxuIl0sImZpbGUiOiJDOi9Vc2Vycy9tYWxvbWFyaS0vRGVza3RvcC9OZXcgZm9sZGVyICg0KS9zcmMvQXBwX2NsZWFuLmpzeCJ9