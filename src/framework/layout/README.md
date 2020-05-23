# Layout

Framework defines layouts for Modules to use. To keep page look and feel consistent across the board, Modules won't be allowed to define their own layouts. They are allowed to use pre-defined layouts from Framework.

To maintain consistent look and feel across the board, Modules are not allowed to implement their own layout (they are free to use `EmptyLayout` and do everything by themselves). This restriction could be changed later on when a module becomes a significant product and need their own layout system.

Currently, Framework defines four layouts:

- `DefaultLayout` (referred in Modules as `Layout.DefaultLayout`): Layout for authenticated modules as being defined in NextGen Design.

- `EmptyLayout` (referred in Modules as `Layout.EmptyLayout`): This layout does not have anything but return the children passed to it. Modules can use this layout to define their own page layout. They are given the whole browser area.

- `BasicLayout` (referred in Modules as `Layout.BasicLayout`): This layout is usually used in unauth pages like Login, Reset Password, Activate Account, etc... It has only the Harness banner on top.

- `NoSubNavLayout` (referred in Modules as `Layout.NoSubNavLayout`): This layout is the same as `DefaultLayout` but only shows module and has no sub-nav.

# Note

`BasicLayout` is not implemented yet.
