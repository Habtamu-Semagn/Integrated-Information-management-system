"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Search, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { api, Fund } from "@/lib/api";
import { toast } from "sonner";

const FUND_TYPES = [
  "Seed Funding",
  "Series A",
  "Series B",
  "Grant",
  "Accelerator",
  "Venture Capital"
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
    open: { variant: "default", label: "Open" },
    closed: { variant: "destructive", label: "Closed" },
    paused: { variant: "secondary", label: "Paused" },
  };
  
  const config = variants[status.toLowerCase()] || variants.open;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default function AdminFundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    fundType: "",
    amount: "",
    deadline: "",
    status: "open"
  });

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      setIsLoading(true);
      const data = await api.funds.getAll();
      setFunds(data);
    } catch (err) {
      console.error("Failed to fetch funds:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFund = async () => {
    if (!createData.name || !createData.fundType || !createData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const fundTypeMap: Record<string, "seed-funding" | "series-a" | "series-b" | "grant" | "accelerator" | "venture-capital"> = {
        "Seed Funding": "seed-funding",
        "Series A": "series-a",
        "Series B": "series-b",
        "Grant": "grant",
        "Accelerator": "accelerator",
        "Venture Capital": "venture-capital"
      };

      await api.funds.create({
        title: createData.name,
        description: createData.description,
        fundType: fundTypeMap[createData.fundType] || "seed-funding",
        minimumAmount: 0,
        maximumAmount: parseInt(createData.amount),
        currency: "USD",
        deadline: new Date(createData.deadline).toISOString(),
        fundingOrganization: "Organization",
        status: createData.status as "open" | "closed" | "paused"
      });
      toast.success("Fund created successfully");
      setIsCreateDialogOpen(false);
      setCreateData({
        name: "",
        description: "",
        fundType: "",
        amount: "",
        deadline: "",
        status: "open"
      });
      fetchFunds();
    } catch (err) {
      console.error("Failed to create fund:", err);
      toast.error("Failed to create fund");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fund?")) return;
    
    try {
      await api.funds.delete(id);
      toast.success("Fund deleted successfully");
      fetchFunds();
    } catch (err) {
      console.error("Failed to delete fund:", err);
      toast.error("Failed to delete fund");
    }
  };

  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fund.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || fund.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Funds Management</h1>
          <p className="text-muted-foreground">Create and manage funding opportunities</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Fund
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Fund</DialogTitle>
              <DialogDescription>Add a new funding opportunity to the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Fund Name *"
                value={createData.name}
                onChange={(e) => setCreateData({...createData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                placeholder="Description"
                value={createData.description}
                onChange={(e) => setCreateData({...createData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <select
                value={createData.fundType}
                onChange={(e) => setCreateData({...createData, fundType: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select Fund Type *</option>
                {FUND_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount *"
                value={createData.amount}
                onChange={(e) => setCreateData({...createData, amount: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <input
                type="date"
                value={createData.deadline}
                onChange={(e) => setCreateData({...createData, deadline: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              />
              <select
                value={createData.status}
                onChange={(e) => setCreateData({...createData, status: e.target.value})}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="paused">Paused</option>
              </select>
              <Button onClick={handleCreateFund} className="w-full">Create Fund</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Funds Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Funds</CardTitle>
          <CardDescription>
            {filteredFunds.length} fund(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Loading funds...</p>
                  </TableCell>
                </TableRow>
              ) : filteredFunds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No funds found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunds.map((fund) => (
                  <TableRow key={fund.id}>
                    <TableCell className="font-medium">{fund.title}</TableCell>
                    <TableCell className="capitalize">{fund.fundType?.replace('-', ' ')}</TableCell>
                    <TableCell>${fund.maximumAmount?.toLocaleString()}</TableCell>
                    <TableCell>{new Date(fund.deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(fund.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/admin/funds/${fund.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(fund.id || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
