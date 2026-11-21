---
label: What's New in 22.2.0
description: The highlights of 22.2.0, an opt-in minor release with header and footer slots, a row end template, a collapsed icon rail, active-row scrolling and back-row context.
order: 1
tags: [ "release-notes", "22.2.0" ]
keywords: [ "what's new", "rail", "collapsedMode", "ngxSidenavHeader", "ngxSidenavFooter", "ngxSidenavItemEnd", "scrollToActive", "backContext" ]
icon: auto_awesome
---

# What's New in 22.2.0

Every feature is opt-in: without them the sidenav renders exactly as in 22.1. All of them are described in
[Menu Composition](../guides/menu-composition.md).

## Header and footer slots

Mark an element `ngxSidenavHeader` to put it above the search box and the menu (a project name, a version picker), or
`ngxSidenavFooter` to pin it below the menu ("Last updated", an edit link). Both are hidden while collapsed.

## Row end template

`<ng-template ngxSidenavItemEnd let-item>` renders the end of every row in place of the built-in badges, for your own
badge styles, child counts or "New" / "Updated" markers.

## Icon rail

`collapsedMode="rail"` keeps the icons of the current level visible while the sidenav is collapsed: a keyboard
toolbar with tooltips that navigates leaves and opens parents. Sized with `--ngx-sidenav-rail-*` tokens; named by the
new optional `rail` label.

## Active row and back-row context

`scrollToActive` keeps the active row in view after navigation, long virtual levels included. `backContext` shows the
title of the level the back row returns to.

## Earlier: 22.1.0

No Angular Material, item icon and glyph templates, 142 theming variables, the responsive overlay, factory providers
and manifest page helpers. Read [From 22.0 to 22.1](../migration/22-0-to-22-1.md) if you upgrade from 22.0.
