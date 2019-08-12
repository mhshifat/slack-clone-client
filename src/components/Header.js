import React from "react";
import { Segment } from "semantic-ui-react";
import styled from "styled-components";

const HeaderWrapper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

const Header = ({ headerContent }) => {
  return (
    <HeaderWrapper>
      <Segment textAlign="center">#{headerContent}</Segment>
    </HeaderWrapper>
  );
};

export default Header;
