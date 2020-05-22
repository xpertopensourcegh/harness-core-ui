# Layout

Framework defines layouts for Modules to use. To keep page look and feel consistent across the board, Modules won't be allowed to define their own layouts. They are allowed to use pre-defined layouts from Framework.

Currently, Framework defines three layouts:

- `DefaultLayout` (referred in Modules as `Layout.DefaultLayout`): Layout for authenticated modules as being defined in NextGen Design.

- `EmptyLayout` (referred in Modules as `Layout.EmptyLayout`): This layout does not have anything but return the children passed to it. Modules can use this layout to define their own page layout. They are given the whole browser area.

- `BasicLayout` (referred in Modules as `Layout.BasicLayout`): This layout is usually used in unauth pages like Login, Reset Password, Activate Account, etc... It has only the Harness banner on top.

# Note

`BasicLayout` is not implemented yet.
