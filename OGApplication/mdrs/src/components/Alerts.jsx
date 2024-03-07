import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export const ErrorAlert = ({ message }) => {

    return (
        <section className="error">
            <div className="error-wrapper mt-2">
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <h4 className="alert-heading">
                        {message}
                    </h4>
                </div>
            </div>
        </section>
    )
}

export const SuccessAlert = ({message}) => {
  return (
        <section >
            <div className="mt-2">
                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <h4 className="alert-heading">
                        {message}
                    </h4>
                </div>
            </div>
        </section>
    )
}
