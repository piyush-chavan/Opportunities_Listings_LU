import React from "react";
import "./report-static-pages.css";

const ReportAppendix = () => {
    return (
        <div className="report-page report-appendix-page">

            {
                [20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31].map((num) => (
                    <div className="page light-bg">
                        <img style={{ width: '100%' }} src={require(`../assets/report-images/Apr25_Pranav Career Assessment and  Psychometric Test-${num}.png`)} alt="report-path" />
                    </div>
                ))
            }

        </div>
    );
};

export default ReportAppendix;