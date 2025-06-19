import styled from "styled-components";
import React, { ReactNode } from "react";

const StyledDiv = styled.div`
  max-width: 100%;

  margin: 0 auto;
  padding: 0 20px;

  height: 100%;
  @media screen and (max-width: 767px) {
    padding: 0 7px;
    img {
    }
  }
`;

//// ✅ Define props type
type CenterProps = {
  children: ReactNode;
};

export default function Center({ children }) {
  return <StyledDiv>{children}</StyledDiv>;
}
