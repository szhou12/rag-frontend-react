import { Prose } from "@/components/ui/prose"
import Markdown from "react-markdown"

const Demo = () => {
  return (
    <Prose mx="auto">
      {/* <Markdown>
        {`
  ## Heading
  
  Based on your Chakra package. So [click here](http://chakra-ui.com) to confirm your plan.
  
  - first item
  - second item
  - second item
  - second item
  
  [title](http://chakra-ui.com)
    `}
      </Markdown> */}
      <Markdown>
        {"## Heading\n\nBased on your Chakra package. So [click here](http://chakra-ui.com) to confirm your plan.\n\n- first item\n- second item\n- second item\n- second item\n\n[title](http://chakra-ui.com)"}
      </Markdown>
    </Prose>
  )
}

export default Demo

