const { json } = require("body-parser");
const supabase = require("../config/database");
const selected_candidat = require("../models/selected_candidat");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const tirage_controller = {
  tirage: async (req, res) => {
    try {
      let { candidats, places } = req.body;

      if (places - 2 < 0) {
        candidats = candidats.filter((item) => item.sexe !== "female");
      }

      const randomIndex = Math.floor(Math.random() * candidats.length);
      const randomObject = candidats[randomIndex];

      if (randomObject.sexe === "female") {
        // If female selected
        const selectedCandidats = [randomObject];
        var mahram = candidats.find(
          (item) =>
            item.numéro_nationale === randomObject.numéro_nationale_mahram
        );
        if (mahram) {
          selectedCandidats.push(mahram);
        } else {
          //search the mahram in the selected list
          mahram = selected_candidat.searchSelectedCandidat(
            randomObject.numéro_nationale_mahram
          );
          if (mahram == "user not found" || mahram == "error") {
            res.status(404).json("mahram not found for this women");
          } else {
            //mahram already chosen so we just need to choose the woman
            mahram = null;
          }
        }

        for (const candidat of selectedCandidats) {
          const data = await selected_candidat.addSelectedCnadidat(
            candidat.id,
            candidat.commune_résidence,
            candidat.numéro_national,
            candidat.wilaya_résidence,
            candidat.firstName_ar,
            candidat.lastName_ar
          );
          if (data === "error") {
            throw new Error("Error saving selected candidat");
          }
        }
      } else {
        // If male selected
        const data = await selected_candidat.addSelectedCnadidat(
          randomObject.id,
          randomObject.commune_résidence,
          randomObject.numéro_national,
          randomObject.wilaya_résidence,
          randomObject.firstName_ar,
          randomObject.lastName_ar
        );
        if (data === "error") {
          throw new Error("Error saving selected candidat");
        }
      }
      //national number+ last name+ first name
      const selectingData = {
        selected1: {
          numéro_national: randomObject.numéro_national,
          first_name: randomObject.firstName_ar,
          last_name: randomObject.lastName_ar,
        },
        selected2:
          randomObject.sexe === "female" && mahram != null
            ? {
                numéro_national: mahram.numéro_national,
                first_name: mahram.firstName_ar,
                last_name: mahram.lastName_ar,
              }
            : null,
      };

      res.status(200).json(selectingData);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCandidats: async (req, res) => {
    try {
      const agentUsername = req.decoded.username;
      console.log(agentUsername);
      const { data, error } = await supabase
        .from("candidats_duplicate")
        .select(
          "id, commune_résidence,numéro_national,wilaya_résidence,firstName_ar,lastName_ar"
        )
        .eq("commune_résidence", agentUsername)
        .eq("dossier_valide", true);

      if (error) {
        throw new Error("Error fetching candidats");
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllselectedCandidates: async (req, res) => {
    try {
      const selectedCandidates =
        await selected_candidat.getAllSelectedCandidates();

      if (selectedCandidates == "error" || selectedCandidates == null) {
        res.status(404).json("error while fetching selected candidates");
      } else {
        // Generate PDF

        const filePath = `${__dirname}/list.pdf`; // Define file path

        const pdfDoc = new PDFDocument({ bufferPages: true }); // Enable buffering for improved performance
        const stream = pdfDoc.pipe(fs.createWriteStream(filePath));

        // Write data to PDF

        const table = {
          headers: [
            "First Name",
            "Last Name",
            "Numéro National",
            "Commune",
            "Wilaya",
            "ID",
          ],
          rows: selectedCandidates.map((item) => [
            item.first_name,
            item.last_name,
            item.numéro_national,
            item.commune,
            item.wilaya,
            item.id,
          ]),
        };

        // Draw table
        drawTable(pdfDoc, {
          x: 25,
          y: 25,
          table,
          options: { fontSize: 12 },
        });

        pdfDoc.end();
        stream.on("finish", () => {
          res.setHeader("Content-Type", "application/pdf");
          res.sendFile(`${__dirname}/list.pdf`);
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

// Function to draw table
function drawTable(doc, { x, y, table, options }) {
  const tableTop = y;
  const tableLeft = x;
  const cellPadding = 5;

  const rowHeight = options.fontSize + cellPadding * 2;

  // Calculate maximum width for each column
  const columnWidths = table.headers.map((header, i) => {
    const headerWidth = doc.widthOfString(header, { align: "left" });
    const maxCellWidth = Math.max(
      headerWidth,
      ...table.rows.map((row) =>
        doc.widthOfString(row[i].toString(), { align: "left" })
      )
    );
    return maxCellWidth + cellPadding * 2;
  });

  doc.font("C:\\Windows\\Fonts\\Arial.ttf");

  doc.fontSize(options.fontSize);

  // Draw headers
  table.headers.forEach((header, i) => {
    doc.text(
      header,
      tableLeft + sum(columnWidths.slice(0, i)) + cellPadding,
      tableTop,
      {
        width: columnWidths[i],
        align: "left",
      }
    );
  });

  // Draw rows
  table.rows.forEach((row, rowIndex) => {
    const yPos = tableTop + rowHeight * (rowIndex + 1);
    row.forEach((cell, cellIndex) => {
      doc.text(
        cell.toString(),
        tableLeft + sum(columnWidths.slice(0, cellIndex)) + cellPadding,
        yPos,
        {
          width: columnWidths[cellIndex],
          align: "left",
        }
      );
    });
  });
}

// Function to calculate the sum of an array
function sum(arr) {
  return arr.reduce((total, num) => total + num, 0);
}

module.exports = tirage_controller;
