import { FormElements } from "./form-elements";
import SidebarBtnElement from "./sidebar-btn-element";

export default function FormElementsSidebar() {
  return (
    <div>
      Elements
      <SidebarBtnElement formElement={FormElements.TextField} />
    </div>
  )
}