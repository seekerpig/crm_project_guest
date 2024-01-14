"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, writeBatch, addDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TabletApplication as TabletApplicationType } from "@/app/data/dataTypes";
import TabletApplication from "@/components/TabletApplication";

const Home = () => {
  const [nric, setNric] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabApplications, setTabletApplications] = useState([] as TabletApplicationType[]);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const searchTablet = async () => {
    setTabletApplications([]);
    setError("");
    const tabApplications = [] as TabletApplicationType[];
    const queryTabletApplications = query(collection(db, "tabletapplications"), where("Applicant_IdentifiedCode", "==", nric), where("Status", "==", "Current"));
    const queryTabletApplicationsSnapshot = await getDocs(queryTabletApplications);
    if (queryTabletApplicationsSnapshot.empty) {
      setError("No matching documents.");
      return;
    }
    queryTabletApplicationsSnapshot.forEach((doc) => {
      tabApplications.push(doc.data() as TabletApplicationType);
    });
    setTabletApplications(tabApplications);
    if (tabApplications.length > 0) {
      setDialogOpen(true);
    }
  };

  return (
    <main className="">
      <div className="container h-full">
        <div className="lg:p-8 lg:m-20 h-full ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-sm text-muted-foreground">Enter your NRIC to search for tablet</p>
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              value={nric}
              placeholder="Identified Code/ NRIC"
              onChange={(e) => {
                setNric(e.target.value as string);
              }}
            />
            <div className="flex">
              <label className="text-xs mr-2">Show NRIC</label>
              <input
                type="checkbox"
                onChange={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </div>

            <Dialog open={dialogOpen && tabApplications.length > 0} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={searchTablet} className="w-full bg-primary text-white py-2 rounded-md">
                  Search
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full flex lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl overflow-y-scroll max-h-[80vh]">
                <DialogHeader className="">
                  <DialogTitle>List of tablet applications corresponding to ID</DialogTitle>
                  <div className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tablet Number</TableHead>
                          <TableHead>Beneficiary 1 English Name</TableHead>
                          <TableHead>Beneficiary 1 Chinese Name</TableHead>
                          <TableHead>Beneficiary 2 English Name</TableHead>
                          <TableHead>Beneficiary 2 Chinese Name</TableHead>
                          <TableHead>Beneficiary 3 English Name</TableHead>
                          <TableHead>Beneficiary 3 Chinese Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tabApplications.map((tabApplications) => (
                          <TableRow key={tabApplications.ApplicationID.toString()}>
                            <TableCell>{tabApplications.Tablet_Number}</TableCell>
                            <TableCell>{tabApplications.Beneficiary1_Name_English}</TableCell>
                            <TableCell>{tabApplications.Beneficiary1_Name_Chinese}</TableCell>
                            <TableCell>{tabApplications.Beneficiary2_Name_English}</TableCell>
                            <TableCell>{tabApplications.Beneficiary2_Name_Chinese}</TableCell>
                            <TableCell>{tabApplications.Beneficiary3_Name_English}</TableCell>
                            <TableCell>{tabApplications.Beneficiary3_Name_Chinese}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
