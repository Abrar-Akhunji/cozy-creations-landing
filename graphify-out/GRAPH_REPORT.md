# Graph Report - afiyafinalweb  (2026-09-01)

## Corpus Check
- 131 files · ~273,853 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 776 nodes · 943 edges · 128 communities (112 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b306d1f8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_cn|cn]]
- [[_COMMUNITY_UserProfileDrawer.tsx|UserProfileDrawer.tsx]]
- [[_COMMUNITY_toggle-group.tsx|toggle-group.tsx]]
- [[_COMMUNITY_scroll-area.tsx|scroll-area.tsx]]
- [[_COMMUNITY_radio-group.tsx|radio-group.tsx]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 115|Community 115]]
- [[_COMMUNITY_Community 116|Community 116]]
- [[_COMMUNITY_Community 117|Community 117]]
- [[_COMMUNITY_Community 118|Community 118]]
- [[_COMMUNITY_Community 119|Community 119]]
- [[_COMMUNITY_Community 120|Community 120]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 123|Community 123]]
- [[_COMMUNITY_Community 124|Community 124]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 126|Community 126]]
- [[_COMMUNITY_Community 130|Community 130]]
- [[_COMMUNITY_Community 131|Community 131]]
- [[_COMMUNITY_Community 132|Community 132]]
- [[_COMMUNITY_Community 133|Community 133]]
- [[_COMMUNITY_Community 134|Community 134]]
- [[_COMMUNITY_Community 136|Community 136]]
- [[_COMMUNITY_Community 137|Community 137]]
- [[_COMMUNITY_Community 138|Community 138]]
- [[_COMMUNITY_Community 139|Community 139]]
- [[_COMMUNITY_Community 143|Community 143]]
- [[_COMMUNITY_Community 151|Community 151]]
- [[_COMMUNITY_Community 171|Community 171]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 70 edges
2. `compilerOptions` - 20 edges
3. `compilerOptions` - 19 edges
4. `compilerOptions` - 14 edges
5. `compilerOptions` - 13 edges
6. `Product` - 12 edges
7. `optimizeCloudinaryUrl()` - 11 edges
8. `compilerOptions` - 9 edges
9. `scripts` - 8 edges
10. `useCart()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts
- `BreadcrumbSeparator()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `BreadcrumbEllipsis()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/breadcrumb.tsx → src/lib/utils.ts
- `CommandShortcut()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/command.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (128 total, 16 thin omitted)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (6): Can I connect a custom domain to my Lovable project?, How can I deploy this project?, How can I edit this code?, Project info, Welcome to your Lovable project, What technologies are used for this project?

### Community 3 - "Community 3"
Cohesion: 0.50
Nodes (3): TabsContent, TabsList, TabsTrigger

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay, AlertDialogTitle

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): Automatic Update Rule, Claude Code Custom Instructions, Graphify Integration

### Community 66 - "cn"
Cohesion: 0.36
Nodes (5): HoverCardContent, ResizableHandle(), ResizablePanelGroup(), Skeleton(), cn()

### Community 67 - "UserProfileDrawer.tsx"
Cohesion: 0.32
Nodes (6): applyFocusStyle(), inputStyle, removeFocusStyle(), UserProfile, UserProfileDrawer(), UserProfileDrawerProps

### Community 68 - "toggle-group.tsx"
Cohesion: 0.33
Nodes (5): ToggleGroup, ToggleGroupContext, ToggleGroupItem, Toggle, toggleVariants

### Community 69 - "scroll-area.tsx"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

### Community 105 - "Community 105"
Cohesion: 0.04
Nodes (48): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers, lucide-react (+40 more)

### Community 106 - "Community 106"
Cohesion: 0.12
Nodes (10): sonner, queryClient, AppLayout(), ScrollToTop(), SiteFooter(), Toaster(), ToasterProps, ProductProvider() (+2 more)

### Community 107 - "Community 107"
Cohesion: 0.05
Nodes (38): Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay (+30 more)

### Community 108 - "Community 108"
Cohesion: 0.06
Nodes (34): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+26 more)

### Community 109 - "Community 109"
Cohesion: 0.05
Nodes (30): AboutMe(), Contact(), YARN_COLORS, YarnColor, FeatureCard(), FeatureCardProps, ProductCard(), ProductCardProps (+22 more)

### Community 110 - "Community 110"
Cohesion: 0.07
Nodes (26): dependencies, firebase, lucide-react, react, react-dom, react-router-dom, devDependencies, autoprefixer (+18 more)

### Community 111 - "Community 111"
Cohesion: 0.18
Nodes (9): Command, CommandDialogProps, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 112 - "Community 112"
Cohesion: 0.12
Nodes (24): Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle, toastVariants (+16 more)

### Community 113 - "Community 113"
Cohesion: 0.12
Nodes (9): NavLink, NavLinkCompatProps, Checkbox, PopoverContent, Progress, ScrollArea, ScrollBar, Slider (+1 more)

### Community 114 - "Community 114"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+14 more)

### Community 115 - "Community 115"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution (+13 more)

### Community 116 - "Community 116"
Cohesion: 0.07
Nodes (39): firebase, BottomDrawerProps, Order, OrderItem, STATUS_FILTERS, SiteHeader(), DEFAULT_COLORS, ProductDetailModal() (+31 more)

### Community 117 - "Community 117"
Cohesion: 0.11
Nodes (21): Tab, BottomDrawer(), BottomDrawerProps, Product, products, app, auth, db (+13 more)

### Community 119 - "Community 119"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 120 - "Community 120"
Cohesion: 0.18
Nodes (12): ButtonProps, buttonVariants, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis(), PaginationItem (+4 more)

### Community 121 - "Community 121"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 122 - "Community 122"
Cohesion: 0.13
Nodes (14): compilerOptions, isolatedModules, lib, module, moduleResolution, noEmit, noFallthroughCasesInSwitch, noImplicitReturns (+6 more)

### Community 123 - "Community 123"
Cohesion: 0.14
Nodes (11): FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue, FormLabel (+3 more)

### Community 124 - "Community 124"
Cohesion: 0.15
Nodes (12): compilerOptions, allowJs, baseUrl, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck (+4 more)

### Community 125 - "Community 125"
Cohesion: 0.06
Nodes (29): ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut(), ContextMenuSubContent (+21 more)

### Community 126 - "Community 126"
Cohesion: 0.18
Nodes (7): ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartTooltipContent, THEMES

### Community 130 - "Community 130"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 131 - "Community 131"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 132 - "Community 132"
Cohesion: 0.25
Nodes (6): DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 133 - "Community 133"
Cohesion: 0.25
Nodes (7): NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 134 - "Community 134"
Cohesion: 0.25
Nodes (7): SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 136 - "Community 136"
Cohesion: 0.40
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 137 - "Community 137"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 138 - "Community 138"
Cohesion: 0.50
Nodes (3): Automatic Update Rule, Codex Custom Instructions, Graphify Integration

### Community 139 - "Community 139"
Cohesion: 0.67
Nodes (3): Badge(), BadgeProps, badgeVariants

### Community 171 - "Community 171"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **431 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+426 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `Community 130`, `Community 131`, `Community 132`, `Community 133`, `Community 134`, `Community 3`, `Community 136`, `Community 8`, `Community 137`, `Community 139`, `Community 9`, `Community 171`, `toggle-group.tsx`, `scroll-area.tsx`, `radio-group.tsx`, `Community 107`, `Community 109`, `Community 111`, `Community 112`, `Community 113`, `Community 116`, `Community 120`, `Community 123`, `Community 125`, `Community 126`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 105` to `Community 116`, `Community 137`, `Community 106`, `Community 108`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `input-otp` connect `Community 137` to `Community 105`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _431 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 105` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `Community 106` be split into smaller, more focused modules?**
  _Cohesion score 0.11688311688311688 - nodes in this community are weakly interconnected._
- **Should `Community 107` be split into smaller, more focused modules?**
  _Cohesion score 0.05179704016913319 - nodes in this community are weakly interconnected._