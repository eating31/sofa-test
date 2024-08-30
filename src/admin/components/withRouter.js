import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function withRouter(Component) {
  return function(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}

export default withRouter;
