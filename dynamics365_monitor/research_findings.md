# Dynamics 365 Monitoring Research

## Overview of Dynamics 365 Monitoring Capabilities

Based on comprehensive research, Dynamics 365 offers various monitoring capabilities across different aspects of the system. This document summarizes the key monitoring areas that will be incorporated into our monitoring dashboard solution.

## 1. API Monitoring

### Key Capabilities:
- **API Request Tracking**: Monitor API calls made to the service
- **Throttling Monitoring**: Track API requests that have been throttled due to exceeding service protection limits
- **Usage Metrics**: View summarized API requests by application and user
- **Execution Time**: Monitor total execution time of API requests

### Available Tools:
- Lifecycle Services (LCS) for Finance and Operations apps
- Environment monitoring dashboard in LCS
- Raw logs queries for API requests

## 2. Error Monitoring

### Key Capabilities:
- **Error Logs**: Access to error logs to identify issues
- **Error Types**: Distinguish between different types of errors (HTTP status codes, API-specific errors)
- **Error Timestamps**: Track when errors occurred
- **Error Frequency**: Monitor how many errors of each type occurred

### Available Tools:
- Error logs in API management section
- Environment monitoring tools in LCS
- Activity tab with predefined queries for common events

## 3. Database Monitoring

### Key Capabilities:
- **Query Performance**: Monitor long-running queries and database execution times
- **Deadlocks**: Identify database deadlocks
- **Resource Utilization**: Track CPU, memory, and disk usage
- **Caching Issues**: Identify performance issues due to caching

### Available Tools:
- Health Metrics dashboard in LCS
- Trace Parser for measuring code execution and database performance
- Diagnostic tools for latency and performance attributes

## 4. Integration Monitoring (including DocuSign)

### Key Capabilities:
- **Integration Status**: Track the status of integrations with third-party systems
- **Document Signing Status**: For DocuSign integration, monitor document status (signed, pending, declined)
- **Integration Performance**: Monitor response times and throughput of integrations
- **Error Tracking**: Identify failed records in integrations

### Available Tools:
- DocuSign for Dynamics 365 app provides tracking capabilities
- Integration monitoring through LCS
- Custom integration monitoring through Dynamics 365 API

## 5. Activity Monitoring

### Key Capabilities:
- **User Activity**: Track user sessions and actions
- **System Load**: Monitor load by activity during defined periods
- **Business Process Usage**: Track frequency of business processes being executed
- **User Adoption**: Analyze usage patterns to improve user adoption

### Available Tools:
- Environment monitoring dashboard in LCS
- Activity tab with predefined queries
- User access and resource usage monitoring

## 6. Performance Monitoring

### Key Capabilities:
- **Response Time**: Measure how fast the system responds to user actions
- **Page Load Time**: Track time taken to load pages
- **User Concurrency**: Monitor concurrent user activity
- **System Resources**: Track CPU, memory, and network utilization

### Available Tools:
- Lifecycle Services for finance and operations apps
- Dataverse analytics for customer engagement apps
- Azure Application Insights

## 7. Security and Compliance Monitoring

### Key Capabilities:
- **User Access**: Monitor who is accessing the system
- **User Actions**: Audit what users are doing with data
- **Compliance**: Ensure adherence to regulatory requirements
- **Data Subject Requests**: Track and respond to data subject requests

### Available Tools:
- Microsoft 365 security tools
- Microsoft Purview compliance portal
- Service health monitoring in Microsoft 365

## 8. Storage and Licensing Monitoring

### Key Capabilities:
- **Storage Usage**: Track how much storage space is being used
- **Storage Growth**: Monitor how fast storage is growing
- **License Usage**: Track which licenses are being used
- **Operational Costs**: Monitor costs based on usage volume

### Available Tools:
- Storage capacity monitoring in Dataverse
- License management in Microsoft 365 admin center
- Subscription monitoring tools

## Conclusion

Dynamics 365 provides comprehensive monitoring capabilities across various aspects of the system. Our monitoring dashboard will integrate these capabilities to provide a unified view of the system's health, performance, and usage. The dashboard will allow administrators to monitor all environments (Production, Preprod, and UAT) separately and provide alerts when issues are detected.
