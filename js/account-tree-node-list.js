"use strict";

function AccountTreeNodeList(id) {
  TreeNodeList.call(this, "account", id);
}

AccountTreeNodeList.prototype = Object.create(TreeNodeList.prototype);
