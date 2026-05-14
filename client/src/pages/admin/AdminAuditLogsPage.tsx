import { useEffect, useState } from "react";
import type { AuditLog } from "../../types/audit_logs/AuditLog";
import type { IAuditLogAPIService } from "../../api_services/audit_logs/IAuditLogAPIService";
import { formatDate } from "../../helpers/format_date";

type AdminAuditLogsPageProps = {
    auditLogApi: IAuditLogAPIService;
};

export default function AdminAuditLogsPage({ auditLogApi }: AdminAuditLogsPageProps){
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            const data = await auditLogApi.getAll();
            setLogs(data);
            setIsLoading(false);
        };

        loadLogs();
    }, [auditLogApi])

    return(
       <main className="min-h-screen bg-slate-100">
            <section className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900">
                    Audit Logs
                </h1>

                <p className="text-gray-600 mt-2">
                    Review recorded user and system activity.
                </p>

                {isLoading ? (
                    <p className="mt-8 text-gray-600">Loading...</p>
                ) : logs.length === 0 ? (
                    <p className="mt-8 text-gray-600">No audit logs found.</p>
                ) : (
                    <div className="mt-8 overflow-x-auto bg-white rounded-2xl shadow-md">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="text-left px-4 py-3">ID</th>
                                    <th className="text-left px-4 py-3">User</th>
                                    <th className="text-left px-4 py-3">Action</th>
                                    <th className="text-left px-4 py-3">Entity</th>
                                    <th className="text-left px-4 py-3">Entity ID</th>
                                    <th className="text-left px-4 py-3">Details</th>
                                    <th className="text-left px-4 py-3">Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-t">
                                        <td className="px-4 py-3">{log.id}</td>
                                        <td className="px-4 py-3">{log.user_id}</td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-orange-100 text-orange-800 px-3 py-1 font-semibold">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{log.entity}</td>
                                        <td className="px-4 py-3">{log.entity_id}</td>
                                        <td className="px-4 py-3">
                                            {log.details ?? "N/A"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(log.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main> 
    );
};