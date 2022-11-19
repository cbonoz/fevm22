import React, { useEffect, useState } from "react";
import { Button, Input, Row, Col, Steps, Result } from "antd";
import { datamarketUrl, ipfsUrl, getExplorerUrl, qrUrl, humanError, } from "../util";
import { EXAMPLE_FORM } from "../constants";
import { FileDrop } from "./FileDrop/FileDrop";
import { uploadFiles } from "../util/stor";
import { deployContract } from "../contract/dataContract";
import { useSigner } from "wagmi";
import TextArea from "antd/lib/input/TextArea";

const { Step } = Steps;

function UploadListing({network, account}) {
  const { data: signer, error: signerError, isLoading: signerLoading, refetch } = useSigner()

  useEffect(() => {
    const networkId = network?.chain?.id
    console.log('network', network)
    if (networkId) {
      refetch()
    }
  }, [network, account])

  const [data, setData] = useState({ ...EXAMPLE_FORM });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const getActiveError = (data) => {
    if (!data.name) {
      return "Please provide a name for the item.";
    }

    return undefined
  };

  const errMessage = getActiveError(data);

  const create = async () => {
    setError(undefined);

    if (errMessage) {
      setError(errMessage)
      return;
    }

    if (!signer) {
      setError("Please connect a valid wallet");
      return;
    }

    setLoading(true);
    const body = { ...data };

    // Format files for upload.
    const files = body.files.map((x) => {
      return x;
    });

    let res = { ...data };

    try {
      // 2) Upload files/metadata to ipfs.
      const cid = await uploadFiles(
        files,
        res
      );

      // 3) return shareable url.
      const contract = await deployContract(signer, data.name, data.description, cid, data.priceEth)
      // 1) deploy base contract with metadata,

      res["datamarketUrl"] = datamarketUrl(contract.address);
      res["cid"] = cid;
      res["contract"] = contract.address;
      res["contractUrl"] = getExplorerUrl(contract.address);

      // Result rendered after successful doc upload + contract creation.
      setResult(res);
    } catch (e) {
      console.error("error creating datamarket request", e);
      const message = e.reason || e.response?.message || e.message
      setError(humanError(message))
    } finally {
      setLoading(false)
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (!errMessage) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <div className="create-form white boxed">
            <h2>Create new datamarket request</h2>
            <br />

            <h3 className="vertical-margin">DataMarket request name:</h3>
            <Input
              placeholder="Name of the datamarket request"
              value={data.name}
              prefix="Name:"
              onChange={(e) => updateData("name", e.target.value)}
            />
            <br/>
            <br/>

            <TextArea
              aria-label="Description"
              onChange={(e) => updateData("description", e.target.value)}
              placeholder="Add any additional description on the dataset"
              prefix="Description"
              value={data.description}
            />

            {/* TODO: add configurable amount of items */}
            <h3 className="vertical-margin">Upload dataset(s) for purchaseable collection</h3>
            <FileDrop
              files={data.files}
              setFiles={(files) => updateData("files", files)}
            />

            <Button
              type="primary"
              className="standard-button"
              onClick={create}
              disabled={loading || errMessage}
              loading={loading}
              size="large"
            >
              Create datamarket request!
            </Button>
            {!error && !result && loading && (
              <span>&nbsp;Note this may take a few moments.</span>
            )}
            <br />
            <br />
            {error && <div className="error-text">Error: {error}</div>}
            {result && (<div>
              <Result     status="success"
 title="Created datamarket request!"/>
              <div>
                <a href={ipfsUrl(result.cid)} target="_blank">
                  View files
                </a>
                <br />
                <a href={result.contractUrl} target="_blank">
                  View created contract
                </a>
                <br />
                <p>
                  Share or post this page with potential customers
                  <br />
                  <a href={result.datamarketUrl} target="_blank">
                    View listing page
                  </a>
                </p>
              </div>
              </div>
            )}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          <div className="white boxed">
            <Steps
              className="standard-margin"
              direction="vertical"
              size="small"
              current={getStep()}
            >
              <Step title="Fill in fields" description="Enter required data." />
              <Step
                title="Create datamarket record"
                description="Deploys a smart contract which will track the dataset"
              />
              <Step
                title="Use the generated QR code to track each unique dataset"
                description="Others can view and provide updates here as the dataset moves"
              />
            </Steps>
          </div>
        </Col>
      </Row>
    </div>
  );
}

UploadListing.propTypes = {};

export default UploadListing;
