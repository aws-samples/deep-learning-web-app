import React from "react";
import { Button } from "reactstrap";

export const LoaderButton = ({
                  text,
                  isLoading,
                  loadingText,
                  className = "",
                  disabled = false,
                  ...rest
                }) =>
  <Button
    type="submit"
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    color="primary"
    {...rest}
  >
    {!isLoading ? text : loadingText}
  </Button>;
